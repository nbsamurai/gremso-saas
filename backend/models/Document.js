const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a document title'],
        trim: true
    },
    fileName: {
        type: String, // from multer originalname
    },
    fileType: {
        type: String, // doc, pdf, image
    },
    fileSizeBytes: {
        type: Number,
        default: 0
    },
    fileUrl: {
        type: String,
        required: [true, 'Please provide a file URL']
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: false
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    managerId: { // Legacy or to know workspace owner
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    workspaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Document', DocumentSchema);
