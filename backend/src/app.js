const express = require('express');
const cors = require('cors');
const reportRoutes = require('./routes/report.routes'); // 1. Impor route yang kita buat

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 2. Gunakan route laporan
// Ini artinya semua URL di report.routes.js akan diawali dengan /api
// Contoh: http://localhost:3000/api/reports
app.use('/api', reportRoutes);

// Test Route sederhana
app.get('/', (req, res) => {
    res.send('API Laporan Siswa Aktif 🚀');
});

module.exports = app;