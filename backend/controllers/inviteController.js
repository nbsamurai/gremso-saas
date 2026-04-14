const User = require('../models/User');
const { getInviteByToken, getValidInviteByToken, acceptInviteForUser, normalizeEmail } = require('../services/inviteService');

exports.validateInvite = async (req, res) => {
    try {
        const invite = await getValidInviteByToken(req.params.token);
        const existingUser = await User.findOne({ email: invite.email }).select('_id email status');

        res.json({
            success: true,
            invite: {
                email: invite.email,
                teamId: invite.teamId._id,
                teamName: invite.teamId.name,
                managerName: invite.managerId.name,
                expiresAt: invite.expiresAt,
                hasAccount: Boolean(existingUser && existingUser.status === 'active')
            }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to validate invite'
        });
    }
};

exports.acceptInvite = async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Invitation token is required'
            });
        }

        const invite = await acceptInviteForUser({ token, user: req.user });

        res.json({
            success: true,
            message: 'Invitation accepted successfully',
            invite: {
                email: invite.email,
                teamId: invite.teamId._id,
                managerId: invite.managerId._id
            },
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                role: req.user.role,
                managerId: req.user.managerId,
                teamId: req.user.teamId,
                workspaceId: req.user.workspaceId,
                firebaseUid: req.user.firebaseUid
            }
        });
    } catch (err) {
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to accept invitation'
        });
    }
};
