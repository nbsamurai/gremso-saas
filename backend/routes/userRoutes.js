const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.get('/approval-action', userController.processOnboardingEmailAction);
router.get('/onboarding-requests', auth, requireRole('Admin'), userController.getOnboardingRequests);
router.patch('/:id/approval', auth, requireRole('Admin'), userController.updateOnboardingApproval);
router.get('/', auth, userController.getUsers);
router.put('/profile', auth, userController.updateProfile);
router.put('/password', auth, userController.updatePassword);

module.exports = router;
