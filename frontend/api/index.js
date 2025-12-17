require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

// Declare a let variable cachedDb = null outside the main handler
let cachedDb = null;

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        family: 4,
        serverSelectionTimeoutMS: 15000,
        heartbeatFrequencyMS: 1000,
    });
};

// Ensure the handler is an async function and await the connection
module.exports = async (req, res) => {
    try {
        await connectDB();
        app(req, res);
    } catch (err) {
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};
