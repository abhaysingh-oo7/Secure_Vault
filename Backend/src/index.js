const express = require('express');
const connectDB = require('./config/db');

const cors = require('cors')
require('dotenv').config();



const app = express();
const PORT = process.env.PORT || 5000;


//connect to MongoDB
connectDB();


//middlemare 
app.use(cors());
app.use(express.json());



//test route
app.get('/', (req, res) => {
    res.send('secure vault api is running...')
});



//start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})




// registered the routes here
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
