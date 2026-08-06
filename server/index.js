const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api', apiRoutes);

// Serve static frontend in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Fallback route for SPA
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'), (err) => {
    if (err) {
      res.send('heyBuddy MERN API Server Running.');
    }
  });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\n⚡ heyBuddy MERN Backend running at http://localhost:${PORT}`);
  });
}

module.exports = app;
