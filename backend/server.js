// Menggunakan CommonJS syntax
require('dotenv').config(); // Memuat variabel dari .env
const mongoose = require('mongoose');
const app = require('./src/app');
const port = process.env.PORT || 3000;

// 1. Koneksi ke MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');

    // 2. Start server hanya setelah koneksi DB berhasil
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error. Check MONGO_URI in .env', err);
    // Keluar dari proses jika koneksi DB gagal
    process.exit(1);
  });