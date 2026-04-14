const express = require('express');
const auth = require('../middleware/authMiddleware');
const planController = require('../controllers/planController');

const router = express.Router();

router.post('/resend-onboarding-request', planController.resendOnboardingRequest);
router.post('/onboarding-request', auth, planController.submitOnboardingRequest);
router.post('/select', auth, planController.selectPlan);
router.get('/me', auth, planController.getCurrentPlan);
router.get('/check/:userId', auth, planController.getPlanCheck);

module.exports = router;
