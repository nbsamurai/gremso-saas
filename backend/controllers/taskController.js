const Task = require('../models/Task');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Project = require('../models/Project');
const mongoose = require('mongoose');

const populateTaskRelations = (query) =>
    query
        .populate('assignedTo', 'name email')
        .populate('projectId', 'name');

exports.createTask = async (req, res) => {
    try {
        if (!['Admin', 'Manager', 'manager'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Only managers can create tasks' });
        }

        const { title, description, priority, status, assignedTo, dueDate, projectId } = req.body;
        if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: 'A valid projectId is required' });
        }

        const project = await Project.findOne({ _id: projectId, workspaceId: req.user.workspaceId }).select('_id');
        if (!project) {
            return res.status(404).json({ message: 'Project not found in this workspace' });
        }

        if (assignedTo) {
            const assignee = await User.findOne({ _id: assignedTo, workspaceId: req.user.workspaceId }).select('_id');
            if (!assignee) {
                return res.status(404).json({ message: 'Assigned user not found in this workspace' });
            }
        }

        const newTask = new Task({
            title,
            description,
            priority,
            status,
            assignedTo,
            dueDate,
            projectId,
            managerId: req.user.id,
            workspaceId: req.user.workspaceId
        });
        const task = await newTask.save();
        const populatedTask = await populateTaskRelations(Task.findById(task._id));

        await Activity.create({
            userId: req.user.id,
            managerId: req.user.id,
            workspaceId: req.user.workspaceId,
            action: 'Task created',
            projectId,
            message: `Created task: ${title}`
        });

        if (assignedTo) {
            const Notification = require('../models/Notification');
            const notif = await Notification.create({
                userId: assignedTo,
                title: 'New Task Assigned',
                message: `You have been assigned to: ${title}`,
                type: 'task_assigned',
                link: `/projects/${projectId}/tasks`
            });
            const io = req.app.locals.io;
            if (io) io.to(assignedTo.toString()).emit('new_notification', notif);
        }

        res.status(201).json(populatedTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const query = { workspaceId: req.user.workspaceId };

        if (req.user.role === 'Worker' || req.user.role === 'member') {
            query.assignedTo = req.user.id;
        }

        if (req.query.projectId) {
            query.projectId = req.query.projectId;
        }

        const tasks = await populateTaskRelations(Task.find(query).sort({ createdAt: -1 }));
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getMyTasks = async (req, res) => {
    try {
        const tasks = await populateTaskRelations(
            Task.find({ assignedTo: req.user.id, workspaceId: req.user.workspaceId }).sort({ createdAt: -1 })
        );
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const query = { projectId, workspaceId: req.user.workspaceId };

        if (req.user.role === 'Worker' || req.user.role === 'member') {
            query.assignedTo = req.user.id;
        }

        const tasks = await populateTaskRelations(Task.find(query).sort({ createdAt: -1 }));
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTask = async (req, res) => {
    try {
        if (!['Manager', 'manager', 'Admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Only managers can fully edit tasks' });
        }
        if (req.body.projectId && !mongoose.Types.ObjectId.isValid(req.body.projectId)) {
            return res.status(400).json({ message: 'A valid projectId is required' });
        }

        if (req.body.projectId) {
            const project = await Project.findOne({ _id: req.body.projectId, workspaceId: req.user.workspaceId }).select('_id');
            if (!project) {
                return res.status(404).json({ message: 'Project not found in this workspace' });
            }
        }

        if (req.body.assignedTo) {
            const assignee = await User.findOne({ _id: req.body.assignedTo, workspaceId: req.user.workspaceId }).select('_id');
            if (!assignee) {
                return res.status(404).json({ message: 'Assigned user not found in this workspace' });
            }
        }

        const task = await populateTaskRelations(
            Task.findOneAndUpdate(
                { _id: req.params.id, workspaceId: req.user.workspaceId },
                { $set: req.body },
                { new: true }
            )
        );
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        if (req.user.role === 'member' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only update tasks assigned to you' });
        }

        const previousStatus = task.status;
        task.status = req.body.status;
        await task.save();

        if (previousStatus !== 'Completed' && req.body.status === 'Completed') {
            const user = await User.findById(req.user.id);
            const userName = user ? user.name.split(' ')[0] : 'Unknown';

            const activity = new Activity({
                userId: req.user.id,
                managerId: req.user.role === 'Manager' || req.user.role === 'manager' ? req.user.id : req.user.managerId,
                workspaceId: req.user.workspaceId,
                message: `Task Completed: ${task.title} â€“ by ${userName}`,
                action: 'Task status updated',
                projectId: task.projectId || null
            });
            await activity.save();
        } else if (previousStatus !== req.body.status) {
            await Activity.create({
                userId: req.user.id,
                managerId: req.user.role === 'Manager' || req.user.role === 'manager' ? req.user.id : req.user.managerId,
                workspaceId: req.user.workspaceId,
                message: `Task Status Updated to ${req.body.status}: ${task.title}`,
                action: 'Task status updated',
                projectId: task.projectId || null
            });
        }

        const populatedTask = await populateTaskRelations(Task.findById(task._id));
        res.json(populatedTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        if (!['Manager', 'manager', 'Admin'].includes(req.user.role)) {
            return res.status(403).json({ message: 'Only managers can delete tasks' });
        }
        const task = await Task.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
