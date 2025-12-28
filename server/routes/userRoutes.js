const router = require('express').Router();
const User = require('../models/user');
const Product = require('../models/product');

// 1. UPDATE USER (For Interests) - NEW ROUTE
router.put('/update/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Updates whatever field we send (like interests)
      { new: true }       // Return the updated version
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. TRACK USER VIEW (Existing)
router.put('/track/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const newHistory = user.searchHistory.filter(item => item.productId !== req.body.productId);
    newHistory.unshift({ productId: req.body.productId, viewedAt: new Date() });
    if (newHistory.length > 10) newHistory.pop();
    user.searchHistory = newHistory;
    await user.save();
    res.status(200).json("View tracked");
  } catch (err) { res.status(500).json(err); }
});

// 3. GET HISTORY PRODUCTS (Existing)
router.get('/history/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");
    const historyIds = user.searchHistory.slice(0, 6).map(h => h.productId);
    const products = await Product.find({ _id: { $in: historyIds } });
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;