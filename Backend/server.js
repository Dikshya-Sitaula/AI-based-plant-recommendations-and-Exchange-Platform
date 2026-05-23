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

     // Basic Route
     app.get('/', (req, res) => {      res.send('Leaf-Life API is running...');
    });
   
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });