const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const auth = require('../middleware/authMiddleware');

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats', auth, statsController.getStats);

// @route   GET api/dashboard
// @desc    Get comprehensive dashboard data
// @access  Private
router.get('/', auth, statsController.getDashboard);

module.exports = router;
