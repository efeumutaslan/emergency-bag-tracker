// backend/controllers/alertController.js
const Item = require('../models/itemModel');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get items nearing expiration
// @route   GET /api/alerts
// @access  Private
const getExpirationAlerts = asyncHandler(async (req, res) => {
  // Get items that will expire in the next 30 days
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  
  const items = await Item.find({
    userId: req.user._id,
    expirationDate: {
      $exists: true,
      $ne: null,
      $lte: thirtyDaysFromNow,
      $gte: new Date()
    }
  }).sort({ expirationDate: 1 });
  
  res.json(items);
});

module.exports = {
  getExpirationAlerts
};