const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoute = require('./routes/authRoutes');
const userRoute = require('./routes/userRoutes');
const dotenv = require('dotenv');
const productRoute = require('./routes/productRoutes');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/products', productRoute);

// Simple Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the Automobile Accessories API!');
});

// 1. ADD THE PING ROUTE HERE
// This lightweight route won't touch the database.
app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'Server is awake!' });
});

// 2. OPTIMIZE THE DATABASE CONNECTION FOR SERVERLESS
// Create a variable to hold the connection globally
let cachedDb = null;

async function connectToDatabase() {
  // If we already have a connection, use it and skip the connection process
  if (cachedDb) {
    console.log("Using existing database connection");
    return cachedDb;
  }
  
  // If no connection exists, create a new one
  console.log("Creating new database connection");
  const connection = await mongoose.connect(process.env.MONGO_URL);
  cachedDb = connection;
  return connection;
}

// Execute the connection function
connectToDatabase()
  .then(() => console.log("DB Connection initialized!"))
  .catch((err) => console.log(err));

// Start Server 
// (Note: Vercel serverless functions often prefer module.exports = app, 
// but if your vercel.json is already handling app.listen, leave it as is)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Added just in case Vercel's Node builder needs to wrap the Express app