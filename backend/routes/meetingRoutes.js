const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const managerOnly = require('../middleware/managerOnly');
const meetingController = require('../controllers/meetingController');
const requirePlanFeature = require('../middleware/requirePlanFeature');

router.post('/create', auth, requirePlanFeature('meetings'), meetingController.createMeeting);
router.get('/', auth, requirePlanFeature('meetings'), meetingController.getMeetings);
router.get('/user/:email', auth, requirePlanFeature('meetings'), meetingController.getMeetingsForUser);
router.delete('/:id', auth, requirePlanFeature('meetings'), managerOnly, meetingController.deleteMeeting);

module.exports = router;
