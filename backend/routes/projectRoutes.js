const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');

router.post('/', auth, requireRole('Admin', 'Manager'), projectController.createProject);
router.get('/', auth, projectController.getProjects); // Everyone sees their relevant projects
router.get('/:id', auth, projectController.getProjectById);
router.put('/:id', auth, requireRole('Admin', 'Manager'), projectController.updateProject);
router.delete('/:id', auth, requireRole('Admin', 'Manager'), projectController.deleteProject);

// Team endpoints
router.get('/:projectId/team', auth, projectController.getProjectTeam);
router.post('/:projectId/team', auth, requireRole('Admin', 'Manager'), projectController.addTeamMember);
router.delete('/:projectId/team/:userId', auth, requireRole('Admin', 'Manager'), projectController.removeTeamMember);

module.exports = router;
