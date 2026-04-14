const crypto = require('crypto');
const TeamInvite = require('../models/TeamInvite');
const TeamMember = require('../models/TeamMember');
const { addUserToTeam } = require('./teamService');

const INVITE_DURATION_MS = 1000 * 60 * 60 * 24 * 7;
const DEFAULT_APP_URL = 'https://www.zentivoratech.com';

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const getInviteBaseUrl = () => {
    const appUrl = process.env.INVITE_APP_URL || process.env.FRONTEND_URL || process.env.APP_URL || DEFAULT_APP_URL;
    return appUrl.replace(/\/$/, '');
};

const appendInviteToken = (url, token) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}inviteToken=${token}`;
};

const buildInviteUrl = (token, mode = 'login') => {
    const appUrl = getInviteBaseUrl();
    const normalizedUrl = appUrl.replace(/\/$/, '');
    const inviteMode = mode === 'signup' ? 'signup' : 'login';
    return `${appendInviteToken(normalizedUrl, token)}&inviteAction=${inviteMode}`;
};

const buildInviteEmail = ({ managerName, teamName, loginUrl, signupUrl }) => ({
    subject: "You're invited to join a team",
    text: [
        `You have been invited by ${managerName} to join ${teamName}.`,
        `Log in to accept your invite: ${loginUrl}`,
        `Create an account to join the team: ${signupUrl}`
    ].join('\n'),
    html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
            <h2 style="margin-bottom: 12px;">You're invited to join a team</h2>
            <p>${managerName} invited you to join <strong>${teamName}</strong> on Zentivora.</p>
            <p style="margin: 24px 0;">
                <a href="${loginUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 18px;background:#2563eb;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;margin-right:12px;">
                    Log In
                </a>
                <a href="${signupUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:12px 18px;background:#1f2937;color:#ffffff;text-decoration:none;border-radius:10px;font-weight:600;">
                    Sign Up
                </a>
            </p>
            <p>If the buttons do not work, open one of these links:</p>
            <p><strong>Login:</strong> <a href="${loginUrl}" target="_blank" rel="noopener noreferrer">${loginUrl}</a></p>
            <p><strong>Signup:</strong> <a href="${signupUrl}" target="_blank" rel="noopener noreferrer">${signupUrl}</a></p>
        </div>
    `
});

const createInviteToken = () => crypto.randomBytes(24).toString('hex');

const getInviteByToken = async (token) => TeamInvite.findOne({ token }).populate('managerId', 'name email').populate('teamId', 'name owner planName billingCycle');

const getValidInviteByToken = async (token) => {
    const invite = await getInviteByToken(token);

    if (!invite) {
        const error = new Error('Invalid invitation token');
        error.statusCode = 404;
        throw error;
    }

    if (invite.status !== 'pending') {
        const error = new Error('This invitation is no longer available');
        error.statusCode = 400;
        throw error;
    }

    if (invite.expiresAt.getTime() < Date.now()) {
        invite.status = 'expired';
        await invite.save();

        const error = new Error('This invitation has expired');
        error.statusCode = 400;
        throw error;
    }

    return invite;
};

const createOrRefreshInvite = async ({ email, managerId, teamId }) => {
    const normalizedEmail = normalizeEmail(email);
    const token = createInviteToken();
    const expiresAt = new Date(Date.now() + INVITE_DURATION_MS);

    const invite = await TeamInvite.findOneAndUpdate(
        { email: normalizedEmail, teamId, status: 'pending' },
        {
            email: normalizedEmail,
            token,
            managerId,
            teamId,
            expiresAt,
            status: 'pending',
            acceptedAt: null,
            acceptedBy: null
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return invite;
};

const acceptInviteForUser = async ({ token, user }) => {
    const invite = await getValidInviteByToken(token);
    const normalizedUserEmail = normalizeEmail(user.email);

    if (normalizedUserEmail !== invite.email) {
        const error = new Error('This invitation belongs to a different email address');
        error.statusCode = 403;
        throw error;
    }

    if (user.teamId && user.teamId.toString() !== invite.teamId._id.toString()) {
        const error = new Error('This account is already linked to another team');
        error.statusCode = 409;
        throw error;
    }

    user.role = 'member';
    user.managerId = invite.managerId._id;
    user.workspaceId = invite.teamId._id;
    user.teamId = invite.teamId._id;
    user.status = 'active';
    await user.save();

    await TeamMember.findOneAndUpdate(
        { email: invite.email, teamId: invite.teamId._id },
        {
            name: user.name,
            email: invite.email,
            role: 'member',
            phone: user.phone || '',
            managerId: invite.managerId._id,
            workspaceId: invite.teamId._id,
            teamId: invite.teamId._id,
            status: 'active',
            joinedAt: new Date()
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    await addUserToTeam(invite.teamId._id, user._id);

    invite.status = 'accepted';
    invite.acceptedAt = new Date();
    invite.acceptedBy = user._id;
    await invite.save();

    return invite;
};

module.exports = {
    normalizeEmail,
    buildInviteUrl,
    buildInviteEmail,
    createOrRefreshInvite,
    getInviteByToken,
    getValidInviteByToken,
    acceptInviteForUser
};
