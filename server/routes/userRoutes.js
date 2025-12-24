const router = require('express').Router();
const User = require('../models/user');

// TRACK USER VIEW (For AI)
router.put('/track/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $push: { searchHistory: { productId: req.body.productId } }
    });
    res.status(200).json("View tracked");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;