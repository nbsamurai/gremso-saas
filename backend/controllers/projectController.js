const mongoose = require('mongoose');
const Project = require('../models/Project');
const User = require('../models/User');

const populateProjectTeam = (query) => query.populate('teamMembers', 'name email role phone');

exports.createProject = async (req, res) => {
    try {
        const { name, clientName, location, startDate, endDate, status, supervisorId } = req.body;
        
        const newProject = new Project({
            name,
            clientName,
            location,
            startDate,
            endDate,
            status,
            supervisorId,
            managerId: req.user.id,
            workspaceId: req.user.workspaceId
        });

        await newProject.save();

        const Activity = require('../models/Activity');
        await new Activity({
            userId: req.user.id,
            managerId: req.user.id,
            workspaceId: req.user.workspaceId,
            action: 'Project created',
            projectId: newProject._id,
            message: `Created new project: ${name}`
        }).save();

        res.status(201).json({ success: true, project: newProject });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getProjects = async (req, res) => {
    try {
        let query = { workspaceId: req.user.workspaceId };
        if (req.user.role === 'Supervisor') {
            query.supervisorId = req.user.id;
        }

        const projects = await Project.find(query).populate('supervisorId', 'name email').sort({ createdAt: -1 });
        res.status(200).json({ success: true, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId })
            .populate('supervisorId', 'name email')
            .populate('managerId', 'name email');
        
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, project });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, workspaceId: req.user.workspaceId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, workspaceId: req.user.workspaceId });
        if (!project) {
            return res.status(404).json({ success: false, message: 'Project not found' });
        }
        res.status(200).json({ success: true, message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.getProjectTeam = async (req, res) => {
    try {
        const project = await populateProjectTeam(Project.findOne({ _id: req.params.projectId, workspaceId: req.user.workspaceId }));
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project.teamMembers || []);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addTeamMember = async (req, res) => {
    try {
        const incomingUserIds = Array.isArray(req.body.userIds)
            ? req.body.userIds
            : req.body.userId
                ? [req.body.userId]
                : [];

        const validUserIds = incomingUserIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
        if (validUserIds.length === 0) {
            return res.status(400).json({ message: 'At least one valid userId is required' });
        }

        const project = await Project.findOne({ _id: req.params.projectId, workspaceId: req.user.workspaceId });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const users = await User.find({ _id: { $in: validUserIds }, workspaceId: req.user.workspaceId }).select('_id');
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found for the provided ids' });
        }

        const existingIds = new Set((project.teamMembers || []).map((id) => id.toString()));
        users.forEach((user) => {
            const userId = user._id.toString();
            if (!existingIds.has(userId)) {
                project.teamMembers.push(user._id);
                existingIds.add(userId);
            }
        });

        await project.save();

        const updatedProject = await populateProjectTeam(Project.findOne({ _id: req.params.projectId, workspaceId: req.user.workspaceId }));
        res.json({
            success: true,
            message: 'Team member(s) added',
            teamMembers: updatedProject?.teamMembers || []
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.removeTeamMember = async (req, res) => {
    try {
        const { userId } = req.params;
        const project = await Project.findOne({ _id: req.params.projectId, workspaceId: req.user.workspaceId });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        project.teamMembers = project.teamMembers.filter(id => id.toString() !== userId);
        await project.save();

        const updatedProject = await populateProjectTeam(Project.findOne({ _id: req.params.projectId, workspaceId: req.user.workspaceId }));
        res.json({
            success: true,
            message: 'Team member removed',
            teamMembers: updatedProject?.teamMembers || []
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
