const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, taskController.getTasks);
router.get('/my-tasks', auth, taskController.getMyTasks);
router.get('/project/:projectId', auth, taskController.getTasksByProject);
router.post('/', auth, taskController.createTask);
router.put('/:id', auth, taskController.updateTask);
router.patch('/:id', auth, taskController.updateTask);
router.patch('/update-status/:id', auth, taskController.updateTaskStatus);
router.delete('/:id', auth, taskController.deleteTask);

module.exports = router;
