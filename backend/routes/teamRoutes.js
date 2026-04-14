const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/members', auth, userController.getTeamMembers);
router.post('/add-member', auth, requireRole('Manager', 'Admin'), userController.createUser);
router.delete('/member/:id', auth, requireRole('Manager', 'Admin'), userController.deleteUser);

module.exports = router;
