const express = require('express');
const Product = require('../models/product'); // We import the blueprint we just made

const router = express.Router();

// 1. ADD A NEW PRODUCT (For Admin)
// The frontend will send a POST request to this address
router.post('/add', async (req, res) => {
  try {
    // We create a new product using the data sent from the frontend (req.body)
    const newProduct = new Product(req.body);
    
    // We save it to the database
    const savedProduct = await newProduct.save();
    
    // If successful, send back the saved data with a "201 Created" status
    res.status(201).json(savedProduct);
  } catch (err) {
    // If there is an error (like missing name), send a "500 Error" message
    res.status(500).json(err);
  }
});

// 2. GET ALL PRODUCTS (For Customers)
// The frontend will send a GET request to fetch everything
router.get('/all', async (req, res) => {
  try {
    // .find() is a MongoDB command that returns everything in the collection
    const products = await Product.find();
    
    // Send the list of products back to the frontend
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET FEATURED PRODUCTS (For Home Page)
router.get('/featured', async (req, res) => {
  try {
    // Find items where isFeatured is TRUE, and give me only 4 of them
    const featuredProducts = await Product.find({ isFeatured: true }).limit(4);
    res.status(200).json(featuredProducts);
  } catch (err) {
    res.status(500).json(err);
  }
});


// 4. DELETE A PRODUCT
// The frontend will send the Product ID to this URL (e.g., /delete/64f8a...)
router.delete('/delete/:id', async (req, res) => {
  try {
    // MongoDB command to find the item by its unique ID and remove it
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
// ... (Keep existing GET and POST routes) ...

// 6. GET SINGLE PRODUCT (By ID)
router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. UPDATE A PRODUCT (Edit existing info)
router.put('/update/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true } // Return the updated version
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ... (Keep DELETE route) ...

module.exports = router; 