const express = require('express');
const router = express.Router();
const db = require('./db');

// Helper to validate email format
const isEmailValid = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

// Helper to validate password criteria
const validatePassword = (password) => {
  const minLength = 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasLetter && hasNumber && hasSpecialChar;
};

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  // 1. Email format check
  if (!isEmailValid(email)) {
    return res.status(400).json({ 
      message: 'Please enter a valid, active email address.' 
    });
  }

  // 2. Password mismatch check
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'invalid password' });
  }

  // 3. Password criteria check
  if (!validatePassword(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long, alphanumeric, and contain at least one special character.' 
    });
  }

  try {
    // 4. Email duplication check
    const [existing] = await db.execute('SELECT email FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Success - Insert user
    await db.execute('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ message: 'Database error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    // 1. Email existence check
    if (!user) {
      await db.execute('INSERT INTO login_history (user_email, status) VALUES (?, ?)', [email, 'failed']);
      return res.status(401).json({ message: 'invalid username' });
    }

    // 2. Password check
    if (user.password !== password) {
      await db.execute('INSERT INTO login_history (user_email, status) VALUES (?, ?)', [email, 'failed']);
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Success - Log history and return
    await db.execute('INSERT INTO login_history (user_email, status) VALUES (?, ?)', [email, 'success']);
    res.status(200).json({ message: 'Login successful', email: user.email });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
