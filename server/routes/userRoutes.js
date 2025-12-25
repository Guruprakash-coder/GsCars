const router = require('express').Router();
const User = require('../models/user');
const Product = require('../models/product');

// TRACK USER VIEW (Existing)
router.put('/track/:id', async (req, res) => {
  try {
    // Logic to prevent duplicates at top of list
    const user = await User.findById(req.params.id);
    // Remove if exists, then add to top
    const newHistory = user.searchHistory.filter(item => item.productId !== req.body.productId);
    newHistory.unshift({ productId: req.body.productId, viewedAt: new Date() });
    
    // Keep only last 10
    if (newHistory.length > 10) newHistory.pop();

    user.searchHistory = newHistory;
    await user.save();
    
    res.status(200).json("View tracked");
  } catch (err) { res.status(500).json(err); }
});

// GET HISTORY PRODUCTS (New)
router.get('/history/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");

    // Get the first 6 Product IDs
    const historyIds = user.searchHistory.slice(0, 6).map(h => h.productId);
    
    // Find Products that match these IDs
    const products = await Product.find({ _id: { $in: historyIds } });

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;