const express = require('express');
const auth = require('../middleware/authMiddleware');
const inviteController = require('../controllers/inviteController');

const router = express.Router();

router.get('/validate/:token', inviteController.validateInvite);
router.post('/accept', auth, inviteController.acceptInvite);

module.exports = router;
