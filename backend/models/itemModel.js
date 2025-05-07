// backend/models/itemModel.js
const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: [true, 'Please add an item name'],
    trim: true
  },
  expirationDate: {
    type: Date
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Medical', 'Food', 'Water', 'Tools', 'Documents', 'Clothing', 'Electronics', 'Other'],
    default: 'Other'
  },
  weight: {
    type: Number,
    required: [true, 'Please add item weight'],
    min: [0, 'Weight cannot be negative']
  },
  weightUnit: {
    type: String,
    enum: ['g', 'kg', 'oz', 'lb'],
    default: 'g'
  },
  quantity: {
    type: Number,
    required: [true, 'Please add item quantity'],
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  notes: {
    type: String,
    trim: true
  },
  isEssential: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;