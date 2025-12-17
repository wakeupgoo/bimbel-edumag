require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../../backend/src/app');

// Gunakan variabel global agar koneksi tidak dibuat berulang-ulang (Re-use connection)
let isConnected = false;

const connectDB = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Error:', err);
    }
};

// Middleware untuk memastikan koneksi sebelum memproses request
app.use(async (req, res, next) => {
    await connectDB();
    next();
});

module.exports = app;