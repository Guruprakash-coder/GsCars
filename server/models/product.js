const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  
  // CHANGED: Now an array of strings
  images: { type: [String], required: true }, 
  
  compatibility: { type: String, enum: ['Universal', 'Specific','Five seater','Seven seater','Luxury(5 seater)','Luxury(7 seater)'], default: 'Universal' },
  compatibleCars: { type: [String], default: [] },
  isFeatured: { type: Boolean, default: false }
});

module.exports = mongoose.model('Product', productSchema);