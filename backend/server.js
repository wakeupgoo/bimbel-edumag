// Menggunakan CommonJS syntax
require('dotenv').config(); // Memuat variabel dari .env
const mongoose = require('mongoose');
const app = require('./src/app');

// 1. Koneksi ke MongoDB secara independen
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error. Check MONGO_URI in .env', err);
    // Keluar dari proses jika koneksi DB gagal
    process.exit(1);
  });

module.exports = app;
