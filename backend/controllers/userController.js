const User = require('../models/User');
const TeamMember = require('../models/TeamMember');
const TeamInvite = require('../models/TeamInvite');
const Workspace = require('../models/Workspace');
const { validateTeamMemberLimit } = require('../services/planValidationService');
const { createOrRefreshInvite, buildInviteEmail, buildInviteUrl, normalizeEmail } = require('../services/inviteService');
const { sendMail } = require('../utils/sendMail');
const {
    APPROVAL_STATUS,
    EMAIL_ACTION_DECISIONS,
    verifyApprovalEmailActionToken
} = require('../utils/userApproval');
const { ensureWorkspaceForUser } = require('../utils/workspace');
const { getPlanDefinition } = require('../config/plans');

const isAdminRole = (role = '') => role.toString().trim().toLowerCase() === 'admin';

const renderApprovalActionPage = ({
    title,
    message,
    tone = 'neutral'
}) => {
    const palette = {
        success: {
            accent: '#16a34a',
            bg: '#f0fdf4',
            border: '#bbf7d0'
        },
        danger: {
            accent: '#dc2626',
            bg: '#fef2f2',
            border: '#fecaca'
        },
        neutral: {
            accent: '#2563eb',
            bg: '#eff6ff',
            border: '#bfdbfe'
        }
    }[tone];

    return `
        <!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>${title}</title>
            </head>
            <body style="margin: 0; font-family: Arial, sans-serif; background: #f6f3ee; color: #1f2937;">
                <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px;">
                    <div style="width: 100%; max-width: 560px; border: 1px solid #e5ded6; border-radius: 24px; background: #ffffff; padding: 32px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);">
                        <div style="display: inline-block; padding: 10px 14px; border-radius: 999px; background: ${palette.bg}; border: 1px solid ${palette.border}; color: ${palette.accent}; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase;">
                            Onboarding Review
                        </div>
                        <h1 style="margin: 18px 0 12px; font-size: 30px; line-height: 1.2;">${title}</h1>
                        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #6b7280;">${message}</p>
                    </div>
                </div>
            </body>
        </html>
    `;
};

const applyOnboardingDecision = async ({ user, decision, reviewerId = null, enforcePending = false }) => {
    if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
    }

    if (!user.approvalRequestedAt) {
        const error = new Error('This user has not submitted an access request');
        error.statusCode = 400;
        throw error;
    }

    if (enforcePending && user.approvalStatus !== APPROVAL_STATUS.PENDING) {
        return {
            changed: false,
            status: user.approvalStatus,
            message:
                user.approvalStatus === APPROVAL_STATUS.APPROVED
                    ? 'This access request has already been approved.'
                    : 'This access request has already been rejected.'
        };
    }

    if (decision === EMAIL_ACTION_DECISIONS.APPROVE) {
        const planDefinition = getPlanDefinition(user.requestedPlanName);
        if (!planDefinition) {
            const error = new Error('The user does not have a valid selected plan to approve');
            error.statusCode = 400;
            throw error;
        }

        user = await ensureWorkspaceForUser(user);
        user.planName = planDefinition.name;
        user.billingCycle = user.requestedBillingCycle || 'monthly';
        user.requiresApproval = false;
        user.approvalStatus = APPROVAL_STATUS.APPROVED;
        user.approvalReviewedAt = new Date();
        user.approvalReviewedBy = reviewerId;
        await user.save();

        if (user.workspaceId) {
            await Workspace.findByIdAndUpdate(user.workspaceId, {
                $set: {
                    planName: planDefinition.name,
                    billingCycle: user.requestedBillingCycle || 'monthly'
                }
            });
        }

        return {
            changed: true,
            status: APPROVAL_STATUS.APPROVED,
            message: 'User approved successfully'
        };
    }

    user.approvalStatus = APPROVAL_STATUS.REJECTED;
    user.approvalReviewedAt = new Date();
    user.approvalReviewedBy = reviewerId;
    await user.save();

    return {
        changed: true,
        status: APPROVAL_STATUS.REJECTED,
        message: 'User rejected successfully'
    };
};

exports.getUsers = async (req, res) => {
    try {
        if (!req.user.workspaceId) {
            return res.json([]);
        }

        const users = await User.find({ workspaceId: req.user.workspaceId })
            .select('name email role phone createdAt')
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

exports.getTeamMembers = async (req, res) => {
    try {
        if (!req.user.workspaceId) {
            return res.json([]);
        }

        const teamMembers = await TeamMember.find({ workspaceId: req.user.workspaceId })
            .select('name email role phone createdAt status')
            .sort({ createdAt: -1 });

        res.json(teamMembers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createUser = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        
        if(!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const normalizedEmail = normalizeEmail(email);

        let teamMember = await TeamMember.findOne({ email: normalizedEmail, managerId: req.user.id });
        if (!teamMember) {
            await validateTeamMemberLimit(req.user.id, 1);
        }

        // 1. Maintain global identity so they can log in
        let user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            user = new User({ 
                name, 
                email: normalizedEmail, 
                role: 'member', 
                phone,
                managerId: req.user.id, // Primary context
                workspaceId: req.user.workspaceId,
                teamId: req.user.teamId || req.user.workspaceId,
                status: 'invited'
            });
            await user.save();
        } else if (user.status === 'invited') {
            user.name = name;
            user.phone = phone;
            user.managerId = req.user.id;
            user.workspaceId = req.user.workspaceId;
            user.teamId = req.user.teamId || req.user.workspaceId;
            await user.save();
        } else if (user.teamId && user.teamId.toString() !== (req.user.teamId || req.user.workspaceId)?.toString()) {
            return res.status(409).json({ message: 'User already belongs to another team' });
        } else {
            user.managerId = req.user.id;
            user.workspaceId = req.user.workspaceId;
            user.teamId = req.user.teamId || req.user.workspaceId;
            user.role = 'member';
            await user.save();
        }

        // 2. Map relation to this specific manager/team
        if (!teamMember) {
            teamMember = new TeamMember({
                name, 
                email: normalizedEmail, 
                role: 'member', 
                phone,
                managerId: req.user.id,
                workspaceId: req.user.workspaceId,
                teamId: req.user.teamId || req.user.workspaceId,
                status: 'invited'
            });
            await teamMember.save();
        } else {
            teamMember.name = name;
            teamMember.phone = phone;
            teamMember.role = 'member';
            teamMember.workspaceId = req.user.workspaceId;
            teamMember.teamId = req.user.teamId || req.user.workspaceId;
            teamMember.status = 'invited';
            await teamMember.save();
        }

        const invite = await createOrRefreshInvite({
            email: normalizedEmail,
            managerId: req.user.id,
            teamId: req.user.teamId || req.user.workspaceId
        });

        const inviteUrl = buildInviteUrl(invite.token, 'login');
        const signupUrl = buildInviteUrl(invite.token, 'signup');
        const inviteEmail = buildInviteEmail({
            managerName: req.user.name || 'Your manager',
            teamName: `${req.user.name || 'Manager'}'s Team`,
            loginUrl: inviteUrl,
            signupUrl
        });

        await sendMail({
            to: normalizedEmail,
            subject: inviteEmail.subject,
            text: inviteEmail.text,
            html: inviteEmail.html
        });

        const Activity = require('../models/Activity');
        await new Activity({
            userId: req.user.id,
            managerId: req.user.id,
            workspaceId: req.user.workspaceId,
            action: 'Team member added',
            message: `Invited team member: ${name} (member)`
        }).save();

        res.status(201).json({ 
            success: true, 
            message: 'Team member invited successfully', 
            user: teamMember,
            inviteUrl,
            signupUrl
        });
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const teamMember = await TeamMember.findById(req.params.id);
        if (!teamMember) return res.status(404).json({ message: 'Member not found in team' });
        if (teamMember.workspaceId?.toString() !== req.user.workspaceId?.toString()) {
            return res.status(403).json({ message: 'Not authorized to remove this member' });
        }

        const teamId = teamMember.teamId || teamMember.workspaceId;
        const linkedUser = await User.findOne({ email: teamMember.email });

        if (linkedUser) {
            if (linkedUser.status === 'invited' && !linkedUser.firebaseUid) {
                await linkedUser.deleteOne();
            } else {
                linkedUser.role = 'manager';
                linkedUser.managerId = undefined;
                linkedUser.workspaceId = undefined;
                linkedUser.teamId = undefined;
                await linkedUser.save();
            }
        }

        if (teamId) {
            await Workspace.findByIdAndUpdate(teamId, {
                $pull: { members: linkedUser?._id }
            });

            await TeamInvite.updateMany(
                { email: teamMember.email, teamId, status: 'pending' },
                { $set: { status: 'revoked' } }
            );
        }

        await teamMember.deleteOne();
        res.json({ message: 'Member removed from team' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        user.name = name || user.name;
        user.phone = phone || user.phone;
        
        await user.save();
        
        user.password = undefined;
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const bcrypt = require('bcrypt');

        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid current password' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getOnboardingRequests = async (req, res) => {
    try {
        if (!isAdminRole(req.user.role)) {
            return res.status(403).json({ message: 'Only admins can review onboarding requests' });
        }

        const requests = await User.find({
            approvalRequestedAt: { $ne: null },
            $or: [
                { requiresApproval: true },
                { approvalStatus: { $in: [APPROVAL_STATUS.PENDING, APPROVAL_STATUS.REJECTED] } }
            ]
        })
            .select(
                'name email phone role requestedPlanName requestedBillingCycle requestedComment approvalStatus approvalRequestedAt approvalReviewedAt createdAt'
            )
            .sort({ approvalRequestedAt: -1, createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateOnboardingApproval = async (req, res) => {
    try {
        if (!isAdminRole(req.user.role)) {
            return res.status(403).json({ message: 'Only admins can approve or reject onboarding requests' });
        }

        const { decision } = req.body;
        if (!['approve', 'reject'].includes(decision)) {
            return res.status(400).json({ message: 'A valid approval decision is required' });
        }

        const user = await User.findById(req.params.id);
        const result = await applyOnboardingDecision({
            user,
            decision,
            reviewerId: req.user._id
        });

        res.json({
            success: true,
            message: result.message
        });
    } catch (err) {
        console.error(err.message);
        res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
    }
};

exports.processOnboardingEmailAction = async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res
                .status(400)
                .send(
                    renderApprovalActionPage({
                        title: 'Approval link is missing',
                        message: 'This onboarding action link is incomplete. Please use the latest email or review the request in the admin panel.',
                        tone: 'danger'
                    })
                );
        }

        const payload = verifyApprovalEmailActionToken(token);
        if (payload?.type !== 'onboarding_email_action' || !payload?.userId) {
            return res
                .status(400)
                .send(
                    renderApprovalActionPage({
                        title: 'Approval link is invalid',
                        message: 'This onboarding action link could not be verified. Please use the latest email or review the request in the admin panel.',
                        tone: 'danger'
                    })
                );
        }

        if (![EMAIL_ACTION_DECISIONS.APPROVE, EMAIL_ACTION_DECISIONS.REJECT].includes(payload.decision)) {
            return res
                .status(400)
                .send(
                    renderApprovalActionPage({
                        title: 'Approval decision is invalid',
                        message: 'This onboarding action link contains an unsupported decision.',
                        tone: 'danger'
                    })
                );
        }

        const user = await User.findById(payload.userId);
        const result = await applyOnboardingDecision({
            user,
            decision: payload.decision,
            enforcePending: true
        });

        return res.send(
            renderApprovalActionPage({
                title:
                    result.status === APPROVAL_STATUS.APPROVED
                        ? 'Access approved'
                        : 'Access rejected',
                message: result.message,
                tone: result.status === APPROVAL_STATUS.APPROVED ? 'success' : 'danger'
            })
        );
    } catch (err) {
        const isExpiredToken = err.name === 'TokenExpiredError';
        const isInvalidToken = err.name === 'JsonWebTokenError';

        if (isExpiredToken || isInvalidToken) {
            return res
                .status(400)
                .send(
                    renderApprovalActionPage({
                        title: isExpiredToken ? 'Approval link expired' : 'Approval link is invalid',
                        message: 'This onboarding action link can no longer be used. Please review the request from a fresh email or use the admin panel.',
                        tone: 'danger'
                    })
                );
        }

        console.error(err.message);
        return res
            .status(err.statusCode || 500)
            .send(
                renderApprovalActionPage({
                    title: 'Approval action failed',
                    message: err.message || 'An unexpected error occurred while processing this onboarding action.',
                    tone: 'danger'
                })
            );
    }
};
