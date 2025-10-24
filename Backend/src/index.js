const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL; // Used for secure CORS configuration

// Connect to MongoDB
connectDB();

// CORS Configuration - IMPORTANT!
const corsOptions = {
    // Ensure CLIENT_URL env var is set on Render to your frontend URL
    origin: CLIENT_URL, 
    credentials: true,
};

// Middleware
app.use(cors(corsOptions)); 
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.send('secure vault api is running...')
});

// -----------------------------------------------------------------
// REGISTER ROUTES BEFORE STARTING SERVER
// -----------------------------------------------------------------

// Authentication Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Vault Data Routes
const vaultRoutes = require('./routes/vault');
app.use('/api/vault', vaultRoutes);

// -----------------------------------------------------------------

// Start server
app.listen(PORT, () => {
    // This console log will still show localhost:5000, but Render manages the public URL
    console.log(`Server running on port ${PORT}`); 
});