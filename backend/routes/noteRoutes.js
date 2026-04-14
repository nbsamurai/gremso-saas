const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const auth = require('../middleware/authMiddleware');
const requirePlanFeature = require('../middleware/requirePlanFeature');

router.get('/:userId', auth, requirePlanFeature('privateNotes'), noteController.getNotes);
router.post('/', auth, requirePlanFeature('privateNotes'), noteController.createNote);
router.put('/:id', auth, requirePlanFeature('privateNotes'), noteController.updateNote);
router.delete('/:id', auth, requirePlanFeature('privateNotes'), noteController.deleteNote);

module.exports = router;
