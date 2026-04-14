const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const Project = require('../models/Project');
const { validateStorageLimit } = require('../services/planValidationService');

exports.createDocument = async (req, res) => {
    try {
        const { title, projectId } = req.body;
        if (projectId && !mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: 'A valid projectId is required'
            });
        }

        if (projectId) {
            const project = await Project.findOne({ _id: projectId, workspaceId: req.user.workspaceId }).select('_id');
            if (!project) {
                return res.status(404).json({
                    success: false,
                    message: 'Project not found in this workspace'
                });
            }
        }

        if (!req.file && !req.body.fileUrl) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        const workspaceManagerId =
            req.user.role === 'Admin' || req.user.role === 'Manager' || req.user.role === 'manager'
                ? req.user.id
                : req.user.managerId;

        const finalFileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl;
        const fileName = req.file ? req.file.originalname : 'External File';
        const fileType = req.file ? req.file.mimetype : 'unknown';
        const fileSizeBytes = req.file ? req.file.size : 0;

        await validateStorageLimit(req.user.id, fileSizeBytes);

        const newDoc = new Document({
            title: title || fileName,
            fileName,
            fileType,
            fileSizeBytes,
            fileUrl: finalFileUrl,
            projectId: projectId || undefined,
            uploadedBy: req.user.id,
            managerId: workspaceManagerId || undefined,
            workspaceId: req.user.workspaceId
        });

        const document = await newDoc.save();
        const populatedDocument = await Document.findById(document._id).populate('uploadedBy', 'name email');

        if (workspaceManagerId) {
            try {
                const Activity = require('../models/Activity');
                await new Activity({
                    userId: req.user.id,
                    managerId: workspaceManagerId,
                    workspaceId: req.user.workspaceId,
                    action: 'Document uploaded',
                    projectId,
                    message: `Uploaded document: ${title || fileName}`
                }).save();
            } catch (activityError) {
                console.error('Document activity log error:', activityError.message);
            }
        }

        res.status(201).json({
            success: true,
            document: populatedDocument
        });
    } catch (err) {
        console.error('Document Upload Error:', err);
        if (req.file?.filename) {
            const uploadedFilePath = path.join(__dirname, '../uploads', req.file.filename);
            if (fs.existsSync(uploadedFilePath)) {
                fs.unlinkSync(uploadedFilePath);
            }
        }
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Document upload failed'
        });
    }
};

exports.getDocumentsByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid projectId'
            });
        }

        const documents = await Document.find({
            projectId,
            workspaceId: req.user.workspaceId
        }).populate('uploadedBy', 'name email').sort({ createdAt: -1 });
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const documents = await Document.find({ workspaceId: req.user.workspaceId }).sort({ createdAt: -1 });
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        if (req.user.role === 'Worker') {
            return res.status(403).json({ message: 'Workers cannot delete documents' });
        }
        const document = await Document.findOne({ _id: req.params.id, workspaceId: req.user.workspaceId });
        if (!document) {
            return res.status(404).json({ message: 'Document not found' });
        }
        await document.deleteOne();
        res.json({ message: 'Document removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};
