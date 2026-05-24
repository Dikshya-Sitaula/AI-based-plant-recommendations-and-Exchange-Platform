 const express = require('express');
     const cors = require('cors');
     require('dotenv').config();
    
     const app = express();
     const PORT = process.env.PORT || 5000;

     // Import routes
     const authRoutes = require('./auth');

     // Middleware
     app.use(cors());
     app.use(express.json());

     // Routes
     app.use('/api/auth', authRoutes);

     // Test Database Connection and Initialize Tables
     const db = require('./db');
     
     const initDB = async () => {
       try {
         await db.execute('SELECT 1');
         console.log('✅ Connected to MySQL database');

         // Create users table if not exists
         await db.execute(`
           CREATE TABLE IF NOT EXISTS users (
             id INT AUTO_INCREMENT PRIMARY KEY,
             full_name VARCHAR(255) NOT NULL,
             email VARCHAR(255) NOT NULL UNIQUE,
             password VARCHAR(255) NOT NULL,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )
         `);

         // Create login_history table if not exists
         await db.execute(`
           CREATE TABLE IF NOT EXISTS login_history (
             id INT AUTO_INCREMENT PRIMARY KEY,
             full_name VARCHAR(255) NOT NULL,
             email VARCHAR(255) NOT NULL,
             password VARCHAR(255) NOT NULL,
             signup_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
           )
         `);
         
         console.log('✅ Database tables initialized');
       } catch (err) {
         console.error('❌ Database initialization failed:', err.message);
       }
     };

     initDB();

     // Basic Route
     app.get('/', (req, res) => {      res.send('Leaf-Life API is running...');
    });
   
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });