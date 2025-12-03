require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const lookupRoutes = require('./routes/lookupRoutes');  // ← NEW

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/lookups', lookupRoutes);  // ← NEW

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: '🥤 Milky Shaky API is running!',
    timestamp: new Date().toISOString()
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth endpoints:`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/signup`);
  console.log(`   - POST http://localhost:${PORT}/api/auth/login`);
  console.log(`🔧 Lookup endpoints:`);
  console.log(`   - GET http://localhost:${PORT}/api/lookups`);
  console.log(`   - POST http://localhost:${PORT}/api/lookups/flavours`);
  console.log(`   - PUT http://localhost:${PORT}/api/lookups/config`);
});

module.exports = app;