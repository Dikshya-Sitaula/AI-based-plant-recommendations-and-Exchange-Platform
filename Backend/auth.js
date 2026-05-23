const express = require('express');
const router = express.Router();
const db = require('./db');

const isEmailValid = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  const minLength = 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasLetter && hasNumber && hasSpecialChar;
};

// Signup Route - Creates the very first record
router.post('/signup', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (!isEmailValid(email)) return res.status(400).json({ message: 'Please enter a valid email.' });
  if (password !== confirmPassword) return res.status(400).json({ message: 'invalid password' });
  if (!validatePassword(password)) return res.status(400).json({ message: 'Password does not meet criteria.' });

  try {
    const [existing] = await db.execute('SELECT email FROM login_history WHERE email = ? LIMIT 1', [email]);
    if (existing.length > 0) return res.status(400).json({ message: 'Email already registered' });

    // Insert the first "Signup" row
    await db.execute('INSERT INTO login_history (email, password) VALUES (?, ?)', [email, password]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Database error' });
  }
});

// Login Route - Adds a NEW row with all info for history
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the very first record for this email to get the original signup_time
    const [rows] = await db.execute('SELECT * FROM login_history WHERE email = ? ORDER BY id ASC LIMIT 1', [email]);
    const originalRecord = rows[0];

    if (!originalRecord) return res.status(401).json({ message: 'invalid username' });
    if (originalRecord.password !== password) return res.status(401).json({ message: 'Invalid password' });

    // SUCCESS: Insert a brand new row into login_history with all details
    await db.execute(
      'INSERT INTO login_history (email, password, signup_time, login_time) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      [originalRecord.email, originalRecord.password, originalRecord.signup_time]
    );

    res.status(200).json({ message: 'Login successful', email: originalRecord.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
