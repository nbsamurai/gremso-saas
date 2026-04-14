const jwt = require('jsonwebtoken');
const { ensureWorkspaceForUser } = require('../utils/workspace');
const { APPROVAL_STATUS, getApprovalMessage, getApprovalStatus } = require('../utils/userApproval');

module.exports = async function (req, res, next) {
    // Get token from header
    const token = req.header('Authorization')?.split(' ')[1] || req.header('x-auth-token');

    // Check if not token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const User = require('../models/User');
        let user = await User.findById(decoded.user.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Token is not valid' });
        }
        user = await ensureWorkspaceForUser(user);
        const approvalStatus = getApprovalStatus(user);
        const isOnboardingRequestRoute = req.originalUrl?.startsWith('/api/plans/onboarding-request');

        if (approvalStatus !== APPROVAL_STATUS.APPROVED && !isOnboardingRequestRoute) {
            return res.status(403).json({
                message: getApprovalMessage(approvalStatus),
                approvalStatus,
                requiresApproval: Boolean(user.requiresApproval)
            });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
