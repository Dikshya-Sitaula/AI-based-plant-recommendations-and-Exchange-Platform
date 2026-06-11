/**
 * Authentication module
 * Handles user registration and login functionalities.
 */
const express = require('express');
const router = express.Router();
const db = require('./db');

// Helper: Validate email format using regex
const isEmailValid = (email) => {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
};

// Helper: Validate password strength (min length, letters, numbers, special characters)
const validatePassword = (password) => {
  const minLength = 6;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  return password.length >= minLength && hasLetter && hasNumber && hasSpecialChar;
};

// Signup Route - Records account details in 'users' table
router.post('/signup', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body;

  if (!fullName || fullName.trim() === '') return res.status(400).json({ message: 'Full Name is required.' });
  if (!isEmailValid(email)) return res.status(400).json({ message: 'Please enter a valid email.' });
  if (password !== confirmPassword) return res.status(400).json({ message: 'Invalid password' });
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

    res.status(201).json({ message: 'User created successfully', fullName });
  } catch (err) {
    console.error('Signup Error:', err);
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

    if (!user) return res.status(401).json({ message: 'Invalid username' });
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
