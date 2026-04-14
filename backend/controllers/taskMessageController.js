const TaskMessage = require('../models/TaskMessage');
const Task = require('../models/Task');

exports.getMessages = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.taskId, workspaceId: req.user.workspaceId }).select('_id assignedTo');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if ((req.user.role === 'Worker' || req.user.role === 'member') && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view these messages' });
        }

        const messages = await TaskMessage.find({ taskId: req.params.taskId })
            .populate('senderId', 'name role')
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addMessage = async (req, res) => {
    try {
        const { taskId, message } = req.body;
        if (!taskId || !message) {
            return res.status(400).json({ message: 'Task ID and message are required' });
        }

        const task = await Task.findOne({ _id: taskId, workspaceId: req.user.workspaceId }).select('_id assignedTo');
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if ((req.user.role === 'Worker' || req.user.role === 'member') && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to add messages to this task' });
        }

        const newMessage = new TaskMessage({
            taskId,
            senderId: req.user.id,
            message
        });

        await newMessage.save();

        // Populate sender details before returning
        await newMessage.populate('senderId', 'name role');

        res.status(201).json(newMessage);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
