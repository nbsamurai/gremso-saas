const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
    try {
        if (req.params.userId !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        const notes = await Note.find({ userId: req.params.userId }).sort({ updatedAt: -1 });
        res.json({ success: true, notes });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { title, content, userId } = req.body;
        
        if (!title || !content || !userId) {
            return res.status(400).json({ success: false, message: 'Title, content, and userId are required' });
        }
        
        if (userId !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const newNote = new Note({
            userId,
            title,
            content
        });
        const note = await newNote.save();
        res.status(201).json({ success: true, note });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Failed to create note' });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        
        if (note.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        note.title = req.body.title !== undefined ? req.body.title : note.title;
        note.content = req.body.content !== undefined ? req.body.content : note.content;
        await note.save();
        
        res.json(note);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if (!note) return res.status(404).json({ message: 'Note not found' });
        
        if (note.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await note.deleteOne();
        res.json({ message: 'Note removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
