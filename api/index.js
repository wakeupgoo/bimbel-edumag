require('dotenv').config();
const express = require('express');
const cors = require('cors');
const reportRoutes = require('./routes/report.routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', reportRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('API Laporan Siswa Aktif 🚀');
});

// Export the app for Vercel
module.exports = app;
