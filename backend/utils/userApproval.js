const jwt = require('jsonwebtoken');

const APPROVAL_STATUS = {
    NOT_SUBMITTED: 'not_submitted',
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected'
};

const EMAIL_ACTION_DECISIONS = {
    APPROVE: 'approve',
    REJECT: 'reject'
};

const isApprovalRequired = (user) => Boolean(user?.requiresApproval);

const getApprovalStatus = (user) => {
    if (!isApprovalRequired(user)) {
        return APPROVAL_STATUS.APPROVED;
    }

    return user?.approvalStatus || APPROVAL_STATUS.APPROVED;
};

const getApprovalMessage = (status) => {
    if (status === APPROVAL_STATUS.PENDING) {
        return 'Your account is under review. Please wait for approval.';
    }

    if (status === APPROVAL_STATUS.REJECTED) {
        return 'Your access request has been rejected.';
    }

    return 'Your account requires approval before access is granted.';
};

const createApprovalEmailActionToken = ({ userId, decision }) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is required to sign approval action tokens');
    }

    return jwt.sign(
        {
            type: 'onboarding_email_action',
            userId,
            decision
        },
        process.env.JWT_SECRET,
        { expiresIn: '14d' }
    );
};

const verifyApprovalEmailActionToken = (token) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is required to verify approval action tokens');
    }

    return jwt.verify(token, process.env.JWT_SECRET);
};

const getApprovalActionBaseUrl = (req) =>
    process.env.APPROVAL_ACTION_BASE_URL ||
    process.env.BACKEND_PUBLIC_URL ||
    process.env.API_BASE_URL ||
    `${req.protocol}://${req.get('host')}`;

const buildApprovalActionUrl = ({ req, token }) =>
    `${getApprovalActionBaseUrl(req).replace(/\/$/, '')}/api/users/approval-action?token=${encodeURIComponent(token)}`;

module.exports = {
    APPROVAL_STATUS,
    EMAIL_ACTION_DECISIONS,
    isApprovalRequired,
    getApprovalStatus,
    getApprovalMessage,
    createApprovalEmailActionToken,
    verifyApprovalEmailActionToken,
    getApprovalActionBaseUrl,
    buildApprovalActionUrl
};
