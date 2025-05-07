// backend/routes/recommendationRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getRecommendations, 
  getEssentialRecommendations 
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRecommendations);
router.get('/essential', protect, getEssentialRecommendations);

module.exports = router;