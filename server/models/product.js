const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  
  // 1. NEW: The Selling Price (Discounted)
  price: { type: Number, required: true },
  
  // 2. NEW: The Original MRP (To show strike-through)
  originalPrice: { type: Number, required: true },
  
  description: { type: String },
  category: { type: String, required: true },
  image: { type: String, required: true },
  compatibility: { type: String, enum: ['Universal', 'Specific'], default: 'Universal' },
  compatibleCars: { type: [String], default: [] },
  isFeatured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', productSchema);