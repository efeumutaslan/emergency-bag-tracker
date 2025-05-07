// backend/routes/alertRoutes.js
const express = require('express');
const router = express.Router();
const { getExpirationAlerts } = require('../controllers/alertController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getExpirationAlerts);

module.exports = router;