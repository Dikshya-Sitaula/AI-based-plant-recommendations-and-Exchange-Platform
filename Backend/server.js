const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { MVP_PLANTS } = require('./plantRules');
const plantDetailsMap = require('./plantDetails');
    
     const app = express();
     const PORT = process.env.PORT || 5000;

     // Import routes
     const authRoutes = require('./auth');

     // Middleware
     app.use(cors());
     app.use(express.json());
     app.use('/plants', express.static(path.join(__dirname, '../public/plants')));

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
            rule VARCHAR(255),
            scientific_name VARCHAR(255),
            nepali_name VARCHAR(255),
            description TEXT,
            is_sold TINYINT(1) DEFAULT 0,
            buyer_id INT
          )`);

          // Alter table dynamically to add new columns if they do not exist
          try {
            await db.execute('ALTER TABLE plants ADD COLUMN scientific_name VARCHAR(255)');
          } catch (err) {
            // Column already exists
          }
          try {
            await db.execute('ALTER TABLE plants ADD COLUMN nepali_name VARCHAR(255)');
          } catch (err) {
            // Column already exists
          }
          try {
            await db.execute('ALTER TABLE plants ADD COLUMN description TEXT');
          } catch (err) {
            // Column already exists
          }

          // Seed initial data if table is empty
          const [rows] = await db.execute('SELECT COUNT(*) as count FROM plants');
          if (rows[0].count === 0) {
            console.log('Seeding initial plant data...');
            const insertQuery = 'INSERT INTO plants (name, type, price, location, image, space_tag, sunlight_need, min_temp, max_temp, purification_score, rule, scientific_name, nepali_name, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            
            for (const plant of MVP_PLANTS) {
              const detail = plantDetailsMap[plant.name] || {};
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
                plant.purification_score,
                plant.rule || '',
                detail.scientificName || '',
                detail.nepaliName || '',
                detail.description || ''
              ]);
            }
            console.log('✅ MVP seed plants added to database');
          }

          // Backfill details for all existing plants
          console.log('Backfilling plant details into database...');
          for (const [name, detail] of Object.entries(plantDetailsMap)) {
            await db.execute(
              'UPDATE plants SET scientific_name = ?, nepali_name = ?, description = ? WHERE name = ? AND (scientific_name IS NULL OR nepali_name IS NULL OR description IS NULL OR scientific_name = \'\' OR nepali_name = \'\' OR description = \'\')',
              [detail.scientificName, detail.nepaliName, detail.description, name]
            );
          }
          console.log('✅ Backfilling completed successfully');
          
          console.log('✅ Database tables initialized');
       } catch (err) {
         console.error('❌ Database initialization failed:', err.message);
       }
     };

     initDB();

     // --- Marketplace Endpoints ---

     // Helper for fetching weather data (Monthly Average)
     async function getMonthlyAverage(city) {
       try {
         const API_KEY = 'TFWSDCS3ZFEDCCJUHYLQHR7GD';
         const month = new Date().getMonth() + 1; // 1-12
         const currentYear = new Date().getFullYear();

         const date1 = `${currentYear}-${month.toString().padStart(2, '0')}-01`;
         const date2 = `${currentYear}-${month.toString().padStart(2, '0')}-28`;

         const cleanCity = (city || 'Kathmandu').split(',')[0].trim();

         const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(cleanCity)}/${date1}/${date2}?unitGroup=metric&include=stats&key=${API_KEY}&contentType=json`;

         const response = await fetch(url);
         if (!response.ok) throw new Error(`Weather API returned ${response.status}`);

         const data = await response.json();
         return data.currentConditions?.temp || data.days?.[0]?.temp || 22;
       } catch (error) {
         console.error('Weather API Error:', error.message);
         return 22; // Default safe temp for recommendations
       }
     }

     /**
      * SMART RECOMMENDATION SYSTEM (144 Combinations)
      * 4 Spaces x 3 Light Levels x 12 Climate Profiles
      */
     app.get('/api/recommend', async (req, res) => {
       try {
         const { space, sunlight, location } = req.query;

         if (!space || !sunlight || !location) {
           return res.status(400).json({ error: 'Missing required parameters: space, sunlight, and location are required.' });
         }
         
         // 1. Environmental Context
         const detectedTemp = await getMonthlyAverage(location);
         const monthIndex = new Date().getMonth(); // 0-11
         const lightMap = { 'Low': 1, 'Medium': 2, 'High': 3 };
         const lightVal = lightMap[sunlight] || 2;

         // 2. Identify the specific profile out of 144
         // (For internal tracking and logic precision)
         const spaceOptions = ['indoor', 'balcony', 'rooftop', 'garden'];
         const spaceIdx = spaceOptions.indexOf(space?.toLowerCase()) || 0;
         const profileId = (spaceIdx * 36) + ((lightVal - 1) * 12) + monthIndex + 1;

         console.log(`[RECOMMEND] Profile #${profileId}/144 | Space=${space}, Light=${sunlight}, Month=${monthIndex + 1}, Temp=${detectedTemp}°C`);
         
         // 3. Build Dynamic Query based on Plant Rules
         let query = 'SELECT * FROM plants WHERE is_sold = 0';
         const params = [];

         if (space && space !== 'Any') {
           query += ' AND LOWER(space_tag) LIKE ?';
           params.push(`%${space.toLowerCase()}%`);
         }

         if (sunlight && sunlight !== 'Any') {
           query += ' AND CAST(sunlight_need AS UNSIGNED) <= ?';
           params.push(lightVal);
         }

         // Temperature Rule
         const finalQuery = query + ' AND ? BETWEEN min_temp AND max_temp';
         const finalParams = [...params, Math.round(detectedTemp)];
         
         let [plants] = await db.execute(finalQuery, finalParams);
         let note = `Perfect match found for Profile #${profileId}.`;

         // 4. Smart Fallbacks (Relaxing constraints systematically)
         if (plants.length === 0) {
           console.log('[RECOMMEND] No climate matches. Relaxing climate constraint.');
           [plants] = await db.execute(query, params);
           note = "Climate threshold relaxed for best-fit recommendation.";
         }

         if (plants.length === 0) {
           console.log('[RECOMMEND] Still no matches. Relaxing sunlight constraint.');
           let basicQuery = 'SELECT * FROM plants WHERE is_sold = 0';
           const basicParams = [];
           if (space && space !== 'Any') {
             basicQuery += ' AND LOWER(space_tag) LIKE ?';
             basicParams.push(`%${space.toLowerCase()}%`);
           }
           [plants] = await db.execute(basicQuery, basicParams);
           note = "Search broadened to find any suitable plants for your space.";
         }

         res.json({
           summary: {
             location: location || 'Kathmandu',
             averageTemp: `${Math.round(detectedTemp)}°C`,
             space: space || 'Indoor',
             sunlight: sunlight || 'Medium',
             profileId: profileId,
             note: note
           },
           plants: plants
         });
       } catch (error) {
         console.error('[RECOMMEND] Error:', error);
         res.status(500).json({ error: 'Failed to generate plant arrangements' });
       }
     });

     app.get('/api/plants', async (req, res) => {
       try {
         const [plants] = await db.execute('SELECT * FROM plants WHERE is_sold = 0');
         res.json(plants);
       } catch (error) {
         res.status(500).json({ error: 'Failed to fetch plants' });
       }
     });

      app.get('/api/plants/:id/images', async (req, res) => {
        try {
          const { id } = req.params;
          const [rows] = await db.execute('SELECT name, image FROM plants WHERE id = ?', [id]);
          const plant = rows[0];
          if (!plant) {
            return res.status(404).json({ error: 'Plant not found' });
          }

          const plantName = plant.name;
          const plantsDir = path.join(__dirname, '../public/plants');

          try {
            const folders = fs.readdirSync(plantsDir);
            const matchedFolder = folders.find(f => {
              const cleanFolder = f.split('(')[0].trim().toLowerCase();
              return cleanFolder === plantName.toLowerCase() || f.toLowerCase() === plantName.toLowerCase();
            });

            if (matchedFolder) {
              const folderPath = path.join(plantsDir, matchedFolder);
              const files = fs.readdirSync(folderPath);
              const images = files
                .filter(file => /\.(jpe?g|png|webp|gif)$/i.test(file))
                .map(file => `/plants/${matchedFolder}/${file}`);
              
              if (images.length > 0) {
                return res.json(images);
              }
            }
          } catch (err) {
            console.error("Error reading plant images directory:", err);
          }

          // Fallback to the main image if folder search fails or returns no images
          res.json([plant.image]);
        } catch (error) {
          console.error("Error in images endpoint:", error);
          res.status(500).json({ error: 'Failed to fetch plant images' });
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
            const insertQuery = 'INSERT INTO plants (name, type, price, location, image, space_tag, sunlight_need, min_temp, max_temp, purification_score, rule, scientific_name, nepali_name, description, is_sold, buyer_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)';
            for (let i = 1; i < quantity; i++) {
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
                plant.purification_score,
                plant.rule || '',
                plant.scientific_name || '',
                plant.nepali_name || '',
                plant.description || '',
                userId
              ]);
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