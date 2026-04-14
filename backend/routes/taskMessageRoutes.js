const express = require('express');
const router = express.Router();
const taskMessageController = require('../controllers/taskMessageController');
const auth = require('../middleware/authMiddleware');

router.get('/messages/:taskId', auth, taskMessageController.getMessages);
router.post('/message', auth, taskMessageController.addMessage);

module.exports = router;
