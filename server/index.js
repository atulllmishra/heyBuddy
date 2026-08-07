require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Vercel Frontend & Localhost
app.use(cors({
  origin: (origin, callback) => {
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

// API Routes
app.use('/api', apiRoutes);

// Serve static React client build files if client/dist exists
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Wildcard SPA Fallback route for client app
app.get('*', (req, res) => {
  const indexPath = path.join(clientDist, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send('⚡ heyBuddy Express API Server is Live & Running on Render.');
  }
});

app.listen(PORT, () => {
  console.log(`\n⚡ heyBuddy Express API Backend running on port ${PORT}`);
});

module.exports = app;
