const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL='https://secure-vault-u532.vercel.app'; // frontend URL

// Connect to MongoDB
connectDB();

// CORS Configuration
const corsOptions = {
    origin: ["secure-vault-7urg.vercel.app","http://localhost:5173",],
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('secure vault api is running...')
});

// --------------------
// REGISTER ROUTES BEFORE STARTING SERVER
// --------------------
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const vaultRoutes = require('./routes/vault');
app.use('/api/vault', vaultRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
