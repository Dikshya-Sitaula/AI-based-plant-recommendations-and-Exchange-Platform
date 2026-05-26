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
     const multer = require('multer');
     const FormData = require('form-data');
     const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
     
     const upload = multer({ storage: multer.memoryStorage() });

     // Middleware
     app.use(cors());
     app.use(express.json());
     app.use('/plants', express.static(path.join(__dirname, '../public/plants')));

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

         // Create payment_sessions table
         await db.execute(`
           CREATE TABLE IF NOT EXISTS payment_sessions (
             id VARCHAR(255) PRIMARY KEY,
             user_id INT,
             cart_items LONGTEXT,
             total_amount INT,
             status VARCHAR(50) DEFAULT 'pending',
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
            buyer_id INT,
            tips_unlocked TINYINT(1) DEFAULT 0
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
          try {
            await db.execute('ALTER TABLE plants ADD COLUMN tips_unlocked TINYINT(1) DEFAULT 0');
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
         const { cartItems, userId, amount } = req.body;
         const sessionId = `PAY-${Date.now()}`;
         
         await db.execute(
           'INSERT INTO payment_sessions (id, user_id, cart_items, total_amount, status) VALUES (?, ?, ?, ?, ?)',
           [sessionId, userId, JSON.stringify(cartItems), amount, 'pending']
         );

         res.json({ sessionId });
       } catch (error) {
         console.error('Payment initiation error:', error);
         res.status(500).json({ error: 'Failed to initiate payment' });
       }
     });

     app.get('/api/payment/status/:sessionId', async (req, res) => {
       try {
         const [rows] = await db.execute('SELECT status FROM payment_sessions WHERE id = ?', [req.params.sessionId]);
         res.json({ status: rows[0]?.status || 'expired' });
       } catch (error) {
         res.status(500).json({ error: 'Failed to fetch payment status' });
       }
     });

     app.get('/api/payment/bill/:sessionId', async (req, res) => {
       try {
         const [rows] = await db.execute('SELECT * FROM payment_sessions WHERE id = ?', [req.params.sessionId]);
         const session = rows[0];
         if (session) {
           session.cart_items = JSON.parse(session.cart_items);
         }
         res.json(session);
       } catch (error) {
         res.status(500).json({ error: 'Failed to fetch bill' });
       }
     });

     app.post('/api/payment/complete/:sessionId', async (req, res) => {
       try {
         const { sessionId } = req.params;
         console.log(`[PAYMENT] Completing session: ${sessionId}`);
         
         // 1. Fetch session details
         const [sessionRows] = await db.execute('SELECT * FROM payment_sessions WHERE id = ?', [sessionId]);
         const session = sessionRows[0];
         
         if (!session) {
           console.error(`[PAYMENT] Session not found: ${sessionId}`);
           return res.status(404).json({ error: 'Session not found' });
         }

         if (session.status === 'completed') {
           console.log(`[PAYMENT] Session ${sessionId} already completed.`);
           return res.json({ success: true, message: 'Already completed' });
         }

         const cartItems = JSON.parse(session.cart_items || '[]');
         const userId = session.user_id || 1;
         console.log(`[PAYMENT] Processing ${cartItems.length} items for User ID: ${userId}`);

         // 2. Process each item in the cart
         for (const item of cartItems) {
           try {
             const plantId = item.id;
             if (!plantId) {
               console.warn(`[PAYMENT] Missing plant ID for item ${item.name}. Skipping.`);
               continue;
             }

             // Special case for "Specialized Care Tips" unlock
             if (item.id.toString().startsWith('UNLOCK-TIPS-')) {
                const actualPlantId = item.id.replace('UNLOCK-TIPS-', '');
                await db.execute('UPDATE plants SET tips_unlocked = 1 WHERE id = ?', [actualPlantId]);
                console.log(`[PAYMENT] Unlocked specialized tips for plant ID: ${actualPlantId}`);
                continue;
             }

             const quantity = item.quantity || 1;

             // Fetch original plant details
             const [plantRows] = await db.execute('SELECT * FROM plants WHERE id = ?', [plantId]);
             const plant = plantRows[0];

             if (plant) {
               // Only update if not already sold (or if sold to this user previously - retry case)
               const [updateResult] = await db.execute(
                 'UPDATE plants SET is_sold = 1, buyer_id = ? WHERE id = ? AND (is_sold = 0 OR buyer_id = ?)', 
                 [userId, plantId, userId]
               );
               
               console.log(`[PAYMENT] Processed plant ${plantId} (${plant.name}). Result: ${updateResult.affectedRows} row(s) updated.`);

               // If multiple quantities were bought, create extra rows
               if (quantity > 1) {
                 const insertQuery = `INSERT INTO plants 
                   (name, type, price, location, image, space_tag, sunlight_need, min_temp, max_temp, purification_score, rule, scientific_name, nepali_name, description, is_sold, buyer_id) 
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`;
                 
                 for (let i = 1; i < quantity; i++) {
                   await db.execute(insertQuery, [
                     plant.name, plant.type, plant.price, plant.location, plant.image, 
                     plant.space_tag, plant.sunlight_need, plant.min_temp, plant.max_temp, 
                     plant.purification_score, plant.rule || '', plant.scientific_name || '', 
                     plant.nepali_name || '', plant.description || '', userId
                   ]);
                 }
                 console.log(`[PAYMENT] Inserted ${quantity - 1} duplicate rows for ${plant.name}`);
               }
             } else {
               console.warn(`[PAYMENT] Plant ID ${plantId} not found in DB. Skipping.`);
             }
           } catch (itemError) {
             console.error(`[PAYMENT] Item processing error:`, itemError.message);
           }
         }

         // 3. Update session status
         await db.execute('UPDATE payment_sessions SET status = ? WHERE id = ?', ['completed', sessionId]);
         console.log(`[PAYMENT] Session ${sessionId} marked as completed.`);
         
         res.json({ success: true });
       } catch (error) {
         console.error('[PAYMENT] Critical error completing payment:', error);
         res.status(500).json({ error: 'Failed to complete payment' });
       }
     });

     app.post('/api/plants/:id/unlock-tips-demo', async (req, res) => {
        try {
            const { id } = req.params;
            await db.execute('UPDATE plants SET tips_unlocked = 1 WHERE id = ?', [id]);
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: 'Failed to unlock tips' });
        }
     });

     // --- Dashboard Endpoints ---
     app.get('/api/user/:userId/collection', async (req, res) => {
       try {
         const { userId } = req.params;
         const [plants] = await db.execute('SELECT * FROM plants WHERE buyer_id = ?', [userId]);
         res.json(plants);
       } catch (error) {
         console.error('Error fetching collection:', error);
         res.status(500).json({ error: 'Failed to fetch collection' });
       }
     });

     app.get('/api/user/:userId/stats', async (req, res) => {
       try {
         const { userId } = req.params;
         const [rows] = await db.execute('SELECT COUNT(*) as ownedCount FROM plants WHERE buyer_id = ?', [userId]);
         const [co2Rows] = await db.execute('SELECT SUM(purification_score) as totalCO2 FROM plants WHERE buyer_id = ?', [userId]);
         
         res.json({
           ownedCount: rows[0].ownedCount || 0,
           totalCO2: (co2Rows[0].totalCO2 * 0.1).toFixed(1) || "0.0" // Simple formula: score * 0.1kg
         });
       } catch (error) {
         console.error('Error fetching stats:', error);
         res.status(500).json({ error: 'Failed to fetch stats' });
       }
     });

     // --- Identification Endpoint ---
     app.post('/api/identify', upload.single('image'), async (req, res) => {
       console.log('[IDENTIFY] Identification request received.');
       try {
         if (!req.file) {
           console.error('[IDENTIFY] No file in request.');
           return res.status(400).json({ error: 'No image uploaded' });
         }

         const API_KEY = process.env.PLANTNET_API_KEY || '2b10EyS9kfkdkzj40wPpe7cnf';
         const url = `https://my-api.plantnet.org/v2/identify/all?api-key=${API_KEY}`;

         console.log(`[IDENTIFY] Processing image: ${req.file.originalname} (${req.file.size} bytes)`);

         const form = new FormData();
         form.append('images', req.file.buffer, { filename: 'image.jpg', contentType: req.file.mimetype });
         form.append('organs', 'leaf');

         console.log('[IDENTIFY] Sending image to Pl@ntNet API...');
         const response = await fetch(url, {
           method: 'POST',
           body: form,
           headers: form.getHeaders()
         });

         if (!response.ok) {
           const errText = await response.text();
           console.error(`[IDENTIFY] Pl@ntNet API error (${response.status}):`, errText);
           return res.status(response.status).json({ error: 'Identification service failed' });
         }

         const data = await response.json();
         const bestMatch = data.results && data.results[0];
         
         if (!bestMatch) {
           console.log('[IDENTIFY] No matches found by Pl@ntNet.');
           return res.json({ found: false });
         }

         // Match with local database
         const scientificName = bestMatch.species.scientificNameWithoutAuthor;
         const commonName = (bestMatch.species.commonNames && bestMatch.species.commonNames[0]) || '';

         console.log(`[IDENTIFY] Best match: ${scientificName} (${commonName}) | Score: ${bestMatch.score}`);

         // Try to find in our DB by scientific name or common name
         // Use more specific match logic
         let localPlant = null;
         try {
            const [rows] = await db.execute(
              'SELECT * FROM plants WHERE (LOWER(scientific_name) = ? OR LOWER(name) = ? OR LOWER(name) LIKE ?) AND is_sold = 0 LIMIT 1',
              [scientificName.toLowerCase(), commonName.toLowerCase(), `%${scientificName.split(' ')[0].toLowerCase()}%`]
            );
            localPlant = rows[0] || null;
         } catch (dbErr) {
            console.error('[IDENTIFY] Database search error:', dbErr.message);
         }

         res.json({
           found: true,
           score: bestMatch.score,
           scientificName: scientificName,
           commonName: commonName,
           localPlant: localPlant,
           allMatches: data.results.slice(0, 3).map(r => ({
             name: (r.species.commonNames && r.species.commonNames[0]) || r.species.scientificNameWithoutAuthor,
             score: r.score
           }))
         });

       } catch (error) {
         console.error('[IDENTIFY] Critical error:', error);
         res.status(500).json({ error: 'Internal server error during identification' });
       }
     });

     // Basic Route
     app.get('/', (req, res) => {      res.send('Leaf-Life API is running...');
    });
   
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });