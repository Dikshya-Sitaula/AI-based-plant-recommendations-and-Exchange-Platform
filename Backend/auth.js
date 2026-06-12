const express = require('express');
const router = express.Router();
const db = require('./db');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for Profile Pictures
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads/profiles');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});


// Polyfill fetch for Node environments without native fetch
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const appleJwksClient = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys'
});

const isEmailValid = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]{2,}(\.[a-zA-Z0-9-]{2,})+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const minLength = 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasLetter && hasNumber && hasSpecialChar;
};

// Helper: Get Apple Public Key
function getApplePublicKey(header, callback) {
  appleJwksClient.getSigningKey(header.kid, (err, key) => {
    if (err) return callback(err);
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
}

// Social Login Logic (Find or Create)
async function handleSocialLogin(req, res, { email, fullName, googleId, appleId }) {
  try {
    // 1. Find user by social ID or email
    let user = null;
    if (googleId) {
      const [rows] = await db.execute('SELECT * FROM users WHERE google_id = ? OR email = ? LIMIT 1', [googleId, email]);
      user = rows[0];
    } else if (appleId) {
      const [rows] = await db.execute('SELECT * FROM users WHERE apple_id = ? OR email = ? LIMIT 1', [appleId, email]);
      user = rows[0];
    }

    if (!user) {
      // 2. Create new user
      const [result] = await db.execute(
        'INSERT INTO users (full_name, email, google_id, apple_id) VALUES (?, ?, ?, ?)',
        [fullName || 'Social User', email, googleId || null, appleId || null]
      );
      
      const [newRows] = await db.execute('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newRows[0];

      // Record Signup in history
      await db.execute(
        'INSERT INTO login_history (full_name, email, password, signup_time, login_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
        [user.full_name, user.email, 'SOCIAL_LOGIN']
      );
    } else {
      // 3. Link account if not linked
      if (googleId && !user.google_id) {
        await db.execute('UPDATE users SET google_id = ? WHERE id = ?', [googleId, user.id]);
      }
      if (appleId && !user.apple_id) {
        await db.execute('UPDATE users SET apple_id = ? WHERE id = ?', [appleId, user.id]);
      }
      
      // Record Login in history
      await db.execute(
        'INSERT INTO login_history (full_name, email, password, signup_time, login_time) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
        [user.full_name, user.email, user.password || 'SOCIAL_LOGIN', user.created_at]
      );
    }

    res.status(200).json({ 
      message: 'Login successful', 
      email: user.email, 
      fullName: user.full_name,
      userId: user.id 
    });
  } catch (err) {
    console.error('Social login error:', err);
    res.status(500).json({ message: 'Authentication failed' });
  }
}

// Google Auth Route
router.post('/google', async (req, res) => {
  const { credential, accessToken, email, fullName, googleId } = req.body;
  
  try {
    if (credential) {
      // Verify ID Token (JWT)
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      
      return await handleSocialLogin(req, res, {
        email: payload.email,
        fullName: payload.name,
        googleId: payload.sub
      });
    } 
    
    if (accessToken) {
      // Verify Access Token via Google's tokeninfo endpoint
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`);
      const info = await response.json();
      
      if (info.error) {
        throw new Error('Invalid access token');
      }

      // Ensure the token belongs to our client and matches the provided email
      if (info.email !== email) {
        throw new Error('Email mismatch');
      }

      return await handleSocialLogin(req, res, {
        email,
        fullName,
        googleId
      });
    }

    // Fallback for legacy/unverified (Not recommended for production)
    if (email && googleId) {
      console.warn('Unverified Google login attempt for:', email);
      return await handleSocialLogin(req, res, { email, fullName, googleId });
    }

    res.status(400).json({ message: 'Missing Google credentials' });
  } catch (err) {
    console.error('Google verification failed:', err.message);
    res.status(401).json({ message: 'Invalid Google token' });
  }
});

// Apple Auth Route
router.post('/apple', (req, res) => {
  const { identityToken, fullName } = req.body;
  
  jwt.verify(identityToken, getApplePublicKey, {
    algorithms: ['RS256'],
    issuer: 'https://appleid.apple.com',
    audience: process.env.APPLE_CLIENT_ID
  }, async (err, payload) => {
    if (err) {
      console.error('Apple token verification failed:', err);
      return res.status(401).json({ message: 'Invalid Apple token' });
    }

    await handleSocialLogin(req, res, {
      email: payload.email,
      fullName: fullName, // Apple only sends name on first sign-up
      appleId: payload.sub
    });
  });
});

// Signup Route - Records account details in 'users' table
router.post('/signup', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || fullName.trim() === '') return res.status(400).json({ message: 'Full Name is required.' });
  if (!isEmailValid(email)) return res.status(400).json({ message: 'invalid username' });
  if (password !== confirmPassword) return res.status(400).json({ message: 'invalid password' });
  if (!validatePassword(password)) return res.status(400).json({ message: 'Password does not meet criteria.' });

  try {
    const [existing] = await db.execute('SELECT email FROM users WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });

    // Insert into the new 'users' table
    const [result] = await db.execute('INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)', [fullName, email, password]);
    
    // Also record the signup event in 'login_history'
    await db.execute(
      'INSERT INTO login_history (full_name, email, password, signup_time, login_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
      [fullName, email, password]
    );

    res.status(201).json({ message: 'User created successfully', fullName, userId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Login Route - Validates from 'users' and records history in 'login_history'
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check credentials against 'users' table
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
    const user = rows[0];

    if (!user) return res.status(401).json({ message: 'invalid username' });
    if (user.password !== password) return res.status(401).json({ message: 'Invalid password' });

    // SUCCESS: Record the login event in 'login_history'
    await db.execute(
      'INSERT INTO login_history (full_name, email, password, signup_time, login_time) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [user.full_name, user.email, user.password, user.created_at]
    );

    res.status(200).json({ 
      message: 'Login successful', 
      email: user.email, 
      fullName: user.full_name,
      userId: user.id 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Profile Info
router.get('/profile/:userId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, full_name, email, phone_number, preferred_location, github_handle, profile_image, created_at FROM users WHERE id = ?',
      [req.params.userId]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    const user = rows[0];
    // Add computed github_url
    user.github_url = user.github_handle ? `https://github.com/${user.github_handle}` : null;
    
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Update Profile Info
router.post('/profile/update', upload.single('profileImage'), async (req, res) => {
  const { userId, fullName, email, phoneNumber, preferredLocation, githubHandle } = req.body;
  const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : null;

  // Safety: Prevent 'undefined' from breaking MySQL query
  const safeFullName = fullName || null;
  const safeEmail = email || null;
  const safePhone = phoneNumber || null;
  const safeLocation = preferredLocation || null;
  const safeGithub = githubHandle || null;

  console.log(`[PROFILE] Update request for User ID: ${userId}`, req.body);

  try {
    // Check if new email is already taken by another user
    if (email) {
      const [existing] = await db.execute('SELECT id FROM users WHERE email = ? AND id != ? LIMIT 1', [email, userId]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'This email is already registered by another account.' });
      }
    }

    let query = 'UPDATE users SET full_name = ?, email = ?, phone_number = ?, preferred_location = ?, github_handle = ?';
    let params = [safeFullName, safeEmail, safePhone, safeLocation, safeGithub];

    if (profileImage) {
      query += ', profile_image = ?';
      params.push(profileImage);
    }

    query += ' WHERE id = ?';
    params.push(userId);

    const [result] = await db.execute(query, params);
    res.json({ message: 'Profile updated successfully', profileImage });
  } catch (err) {
    console.error(`[PROFILE] Update error for User ${userId}:`, err.message);
    res.status(500).json({ message: `Failed to update profile: ${err.message}` });
  }
});



// Change Password
router.post('/profile/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const [rows] = await db.execute('SELECT password FROM users WHERE id = ?', [userId]);
    if (rows.length === 0) return res.status(404).json({ message: 'User not found' });
    
    if (rows[0].password && rows[0].password !== currentPassword) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ message: 'New password does not meet criteria.' });
    }

    await db.execute('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);
    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to change password' });
  }
});

// Delete Account
router.post('/profile/delete', async (req, res) => {
  const { userId } = req.body;

  try {
    // 1. Delete user from users table
    await db.execute('DELETE FROM users WHERE id = ?', [userId]);
    // 2. Optionally delete plants or mark them as orphaned
    // await db.execute('UPDATE plants SET buyer_id = NULL WHERE buyer_id = ?', [userId]);
    
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete account' });
  }
});

module.exports = router;
