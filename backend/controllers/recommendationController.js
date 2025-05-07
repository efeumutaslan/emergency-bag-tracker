// backend/controllers/recommendationController.js
const Recommendation = require('../models/recommendationModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all recommendations
// @route   GET /api/recommendations
// @access  Private
const getRecommendations = asyncHandler(async (req, res) => {
  const { category } = req.query;
  
  let query = {};
  if (category) {
    query.category = category;
  }
  
  const recommendations = await Recommendation.find(query).sort({ popularity: -1 });
  res.json(recommendations);
});

// @desc    Get essential recommendations
// @route   GET /api/recommendations/essential
// @access  Private
const getEssentialRecommendations = asyncHandler(async (req, res) => {
  const recommendations = await Recommendation.find({ isEssential: true }).sort({ popularity: -1 });
  res.json(recommendations);
});

module.exports = {
  getRecommendations,
  getEssentialRecommendations
};