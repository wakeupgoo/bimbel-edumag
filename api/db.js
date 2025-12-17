const mongoose = require('mongoose');

let cachedDb = null;

const connectDB = async () => {
    if (cachedDb && mongoose.connection.readyState >= 1) {
        return cachedDb;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            family: 4,
            serverSelectionTimeoutMS: 15000,
            heartbeatFrequencyMS: 1000,
        });
        cachedDb = conn;
        console.log('✅ Connected to MongoDB Atlas');
        return cachedDb;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        throw error;
    }
};

module.exports = connectDB;
