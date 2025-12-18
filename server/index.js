const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoute = require('./routes/productRoutes'); // We just created this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoute);

// Simple Welcome Route
app.get('/', (req, res) => {
  res.send('Welcome to the Automobile Accessories API!');
});


// DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connection Successful!"))
  .catch((err) => {
    console.log(err);
  });
// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});