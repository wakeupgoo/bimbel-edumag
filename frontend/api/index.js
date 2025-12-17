require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../../backend/src/app');

// Disable buffering to avoid timeouts in serverless
mongoose.set('bufferCommands', false);

// Gunakan variabel global agar koneksi tidak dibuat berulang-ulang (Re-use connection)
let isConnected = false;

const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        isConnected = true;
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB Error:', err);
        throw err; // Re-throw to handle in middleware
    }
};

// Middleware untuk memastikan koneksi sebelum memproses request
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

module.exports = app;
