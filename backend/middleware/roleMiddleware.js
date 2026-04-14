const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ success: false, message: 'Not authorized, no role' });
        }
        
        let userRole = req.user.role;
        // Backward compatibility
        if (userRole === 'manager') userRole = 'Manager';
        if (userRole === 'member') userRole = 'Worker';

        if (!roles.includes(userRole)) {
            return res.status(403).json({ success: false, message: `Access denied: insufficient permissions` });
        }
        next();
    };
};

module.exports = { requireRole };
