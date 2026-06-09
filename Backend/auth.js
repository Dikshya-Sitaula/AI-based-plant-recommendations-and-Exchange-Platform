const express = require('express');
const router = express.Router();
const db = require('./db');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const appleJwksClient = jwksClient({
  jwksUri: 'https://appleid.apple.com/auth/keys'
});

const isEmailValid = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && !email.includes('@.');
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
  const { credential } = req.body;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    await handleSocialLogin(req, res, {
      email: payload.email,
      fullName: payload.name,
      googleId: payload.sub
    });
  } catch (err) {
    console.error('Google token verification failed:', err);
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

module.exports = router;
