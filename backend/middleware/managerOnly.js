module.exports = function managerOnly(req, res, next) {
    if (req.user.role !== 'manager') {
        return res.status(403).json({ message: 'Only manager can delete meetings' });
    }

    next();
};
