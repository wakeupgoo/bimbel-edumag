require('dotenv').config();
const mongoose = require('mongoose');
const app = require('../../backend/src/app');

// Disable buffering to avoid timeouts in serverless
mongoose.set('bufferCommands', false);

// Gunakan variabel global agar koneksi tidak dibuat berulang-ulang (Re-use connection)
let isConnected = false;

const connectDB = async () => {
    console.log('🔍 Checking MongoDB connection...');
    console.log('MONGO_URI exists:', !!process.env.MONGO_URI);
    console.log('Current readyState:', mongoose.connection.readyState);

    if (isConnected && mongoose.connection.readyState === 1) {
        console.log('✅ Using existing MongoDB connection');
        return;
    }

    try {
        console.log('🔄 Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });
        isConnected = true;
        console.log('✅ Connected to MongoDB successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        console.error('Full error:', err);
        throw err; // Re-throw to handle in middleware
    }
};

// Middleware untuk memastikan koneksi sebelum memproses request
app.use(async (req, res, next) => {
    try {
        console.log(`📡 ${req.method} ${req.path} - Connecting to DB...`);
        await connectDB();
        console.log(`✅ ${req.method} ${req.path} - DB connected, proceeding...`);
        next();
    } catch (err) {
        console.error(`❌ ${req.method} ${req.path} - DB connection failed:`, err.message);
        res.status(500).json({ error: 'Database connection failed', details: err.message });
    }
});

module.exports = app;
