require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Vercel Frontend & Localhost
app.use(cors({
  origin: (origin, callback) => {
    // Allow any origin or non-browser request
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

// Render Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'heyBuddy Express API', timestamp: new Date() });
});

// Root route for standalone backend
app.get('/', (req, res) => {
  res.send('⚡ heyBuddy Express API Server is Live & Running on Render.');
});

// API Routes
app.use('/api', apiRoutes);

// Fallback route for static client if served together
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

app.listen(PORT, () => {
  console.log(`\n⚡ heyBuddy Express API Backend running on port ${PORT}`);
});

module.exports = app;
