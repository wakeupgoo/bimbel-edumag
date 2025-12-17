const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const reportRoutes = require('./routes/report.routes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', reportRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API is running' });
});

// Test Route sederhana
app.get('/', (req, res) => {
    res.send('API Laporan Siswa Aktif 🚀');
});

module.exports = app;
