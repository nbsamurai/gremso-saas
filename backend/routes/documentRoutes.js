const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const auth = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

// @route   POST api/documents
// @desc    Upload document
// @access  Private
router.post('/', auth, (req, res, next) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload failed'
            });
        }

        next();
    });
}, documentController.createDocument);

// @route   GET api/documents/project/:projectId
// @desc    View documents by project
// @access  Private
router.get('/project/:projectId', auth, documentController.getDocumentsByProject);

// @route   GET api/documents
// @desc    View documents
// @access  Private
router.get('/', auth, documentController.getDocuments);

// @route   DELETE api/documents/:id
// @desc    Delete document
// @access  Private
router.delete('/:id', auth, documentController.deleteDocument);

module.exports = router;
