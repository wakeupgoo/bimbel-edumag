require('dotenv').config();
const connectDB = require('./db');
const app = require('./app');

let cachedDb = null;

module.exports = async (req, res) => {
    try {
        // Connect to DB if not already connected
        if (!cachedDb) {
            cachedDb = await connectDB();
        }

        // Handle the request with Express app
        app(req, res);
    } catch (err) {
        console.error('Serverless function error:', err);
        res.status(500).json({ error: err.message });
    }
};
