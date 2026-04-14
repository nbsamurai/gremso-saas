const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, notificationController.getNotifications);
router.patch('/read-all', auth, notificationController.markAsRead);
router.patch('/:id/read', auth, notificationController.markOneAsRead);

module.exports = router;
