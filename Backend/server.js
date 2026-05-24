 const express = require('express');
     const cors = require('cors');
     require('dotenv').config();
     const { MVP_PLANTS } = require('./plantRules');
    
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
     
     // In-memory store for payment sessions
     const paymentSessions = new Map();

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

         // Create Plants Table
         await db.execute(`CREATE TABLE IF NOT EXISTS plants (
           id INT AUTO_INCREMENT PRIMARY KEY,
           name VARCHAR(255) NOT NULL,
           type VARCHAR(255) NOT NULL,
           price VARCHAR(255) NOT NULL,
           location VARCHAR(255) NOT NULL,
           image VARCHAR(255) NOT NULL,
           space_tag VARCHAR(255) NOT NULL,
           sunlight_need VARCHAR(50) NOT NULL,
           min_temp INT DEFAULT 10,
           max_temp INT DEFAULT 35,
           purification_score INT DEFAULT 5,
           is_sold TINYINT(1) DEFAULT 0,
           buyer_id INT
         )`);

         // Seed initial data if table is empty
         const [rows] = await db.execute('SELECT COUNT(*) as count FROM plants');
         if (rows[0].count === 0) {
           console.log('Seeding initial plant data...');
           const insertQuery = 'INSERT INTO plants (name, type, price, location, image, space_tag, sunlight_need, min_temp, max_temp, purification_score) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
           
           for (const plant of MVP_PLANTS) {
             await db.execute(insertQuery, [
               plant.name, 
               plant.type, 
               plant.price, 
               plant.location, 
               plant.image, 
               plant.space_tag, 
               plant.sunlight_need, 
               plant.min_temp, 
               plant.max_temp, 
               plant.purification_score
             ]);
           }
           console.log('✅ MVP seed plants added to database');
         }
         
         console.log('✅ Database tables initialized');
       } catch (err) {
         console.error('❌ Database initialization failed:', err.message);
       }
     };

     initDB();

     // --- Marketplace Endpoints ---

     app.get('/api/plants', async (req, res) => {
       try {
         const [plants] = await db.execute('SELECT * FROM plants WHERE is_sold = 0');
         res.json(plants);
       } catch (error) {
         res.status(500).json({ error: 'Failed to fetch plants' });
       }
     });

     app.post('/api/plants/:id/buy', async (req, res) => {
       try {
         const { id } = req.params;
         const { userId, quantity = 1 } = req.body;

         const [rows] = await db.execute('SELECT * FROM plants WHERE id = ?', [id]);
         const plant = rows[0];
         if (!plant) return res.status(404).json({ error: 'Plant not found' });
         
         await db.execute('UPDATE plants SET is_sold = 1, buyer_id = ? WHERE id = ?', [userId, id]);

         if (quantity > 1) {
           const insertQuery = 'INSERT INTO plants (name, type, price, location, image, space_tag, sunlight_need, min_temp, max_temp, purification_score, is_sold, buyer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)';
           for (let i = 1; i < quantity; i++) {
             await db.execute(insertQuery, [plant.name, plant.type, plant.price, plant.location, plant.image, plant.space_tag, plant.sunlight_need, plant.min_temp, plant.max_temp, plant.purification_score, userId]);
           }
         }

         res.json({ message: `Success` });
       } catch (error) {
         console.error('Purchase error:', error);
         res.status(500).json({ error: 'Purchase failed' });
       }
     });

     // --- Payment Endpoints ---

     app.post('/api/payment/initiate', async (req, res) => {
       try {
         const { plantId, userId, quantity, amount } = req.body;
         
         const [rows] = await db.execute('SELECT name FROM plants WHERE id = ?', [plantId]);
         const plant = rows[0];
         const plantName = plant ? plant.name : 'Plant';

         const sessionId = `PAY-${Date.now()}`;
         paymentSessions.set(sessionId, { 
           id: sessionId, 
           plantId, 
           plantName,
           userId, 
           quantity, 
           amount, 
           status: 'pending', 
           createdAt: new Date() 
         });
         res.json({ sessionId });
       } catch (error) {
         res.status(500).json({ error: 'Failed to initiate payment' });
       }
     });

     app.get('/api/payment/status/:sessionId', (req, res) => {
       const session = paymentSessions.get(req.params.sessionId);
       res.json({ status: session?.status || 'expired' });
     });

     app.get('/api/payment/bill/:sessionId', (req, res) => {
       res.json(paymentSessions.get(req.params.sessionId));
     });

     app.post('/api/payment/complete/:sessionId', (req, res) => {
       const session = paymentSessions.get(req.params.sessionId);
       if (session) {
         session.status = 'completed';
         paymentSessions.set(req.params.sessionId, session);
       }
       res.json({ success: true });
     });

     // Basic Route
     app.get('/', (req, res) => {      res.send('Leaf-Life API is running...');
    });
   
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });