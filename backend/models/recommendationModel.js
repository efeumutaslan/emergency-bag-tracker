// backend/models/recommendationModel.js
const mongoose = require('mongoose');

const recommendationSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Medical', 'Food', 'Water', 'Tools', 'Documents', 'Clothing', 'Electronics', 'Other'],
    default: 'Other'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  averageWeight: {
    type: Number,
    required: true,
    min: [0, 'Weight cannot be negative']
  },
  weightUnit: {
    type: String,
    enum: ['g', 'kg', 'oz', 'lb'],
    default: 'g'
  },
  isEssential: {
    type: Boolean,
    default: false
  },
  popularity: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;