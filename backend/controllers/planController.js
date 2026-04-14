const { selectManagerPlan, checkUserPlan } = require('../services/planService');
const { DEFAULT_BILLING_CYCLE, getPlanDefinition } = require('../config/plans');
const { sendMail } = require('../utils/sendMail');
const {
    APPROVAL_STATUS,
    EMAIL_ACTION_DECISIONS,
    buildApprovalActionUrl,
    createApprovalEmailActionToken,
    getApprovalStatus
} = require('../utils/userApproval');

const REVIEW_RECIPIENT = 'ranaravi151093@gmail.com';

const normalizeBillingCycle = (billingCycle) => (billingCycle === 'yearly' ? 'yearly' : DEFAULT_BILLING_CYCLE);
const normalizeText = (value, fallback = '') => (typeof value === 'string' && value.trim() ? value.trim() : fallback);

const resolveOnboardingEmailData = (user) => {
    const planName = user.requestedPlanName || user.planName;
    const planDefinition = getPlanDefinition(planName);

    if (!planDefinition) {
        const error = new Error('A valid selected plan is required before the onboarding request can be emailed.');
        error.statusCode = 400;
        throw error;
    }

    return {
        name: normalizeText(user.name, 'Not provided'),
        phone: normalizeText(user.phone, 'Not provided'),
        email: normalizeText(user.email),
        comment: normalizeText(user.requestedComment, 'Not provided'),
        planName: planDefinition.name,
        billingCycle: normalizeBillingCycle(user.requestedBillingCycle || user.billingCycle)
    };
};

const buildOnboardingEmail = ({ name, phone, email, comment, planName, billingCycle, approveUrl, rejectUrl }) => {
    const planDefinition = getPlanDefinition(planName);
    const planLabel = planDefinition?.label || planName;
    const cycleLabel = billingCycle === 'yearly' ? 'Yearly' : 'Monthly';

    return {
        subject: `New onboarding approval request: ${name}`,
        text: [
            'A new user has requested access.',
            '',
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Email: ${email}`,
            `Selected Plan: ${planLabel}`,
            `Billing Cycle: ${cycleLabel}`,
            `Comment: ${comment}`,
            '',
            `Approve access: ${approveUrl}`,
            `Reject access: ${rejectUrl}`
        ].join('\n'),
        html: `
            <div style="font-family: Arial, sans-serif; color: #1f2937;">
                <h2 style="margin-bottom: 16px;">New onboarding approval request</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Selected Plan:</strong> ${planLabel}</p>
                <p><strong>Billing Cycle:</strong> ${cycleLabel}</p>
                <p><strong>Comment:</strong> ${comment}</p>
                <div style="margin-top: 24px;">
                    <a href="${approveUrl}" style="display: inline-block; margin-right: 12px; padding: 12px 18px; border-radius: 10px; background: #16a34a; color: #ffffff; text-decoration: none; font-weight: 600;">
                        Approve Access
                    </a>
                    <a href="${rejectUrl}" style="display: inline-block; padding: 12px 18px; border-radius: 10px; background: #dc2626; color: #ffffff; text-decoration: none; font-weight: 600;">
                        Reject Access
                    </a>
                </div>
                <p style="margin-top: 16px; font-size: 13px; color: #6b7280;">
                    If the buttons do not work, use these links:
                </p>
                <p style="font-size: 13px; word-break: break-all;"><strong>Approve:</strong> <a href="${approveUrl}">${approveUrl}</a></p>
                <p style="font-size: 13px; word-break: break-all;"><strong>Reject:</strong> <a href="${rejectUrl}">${rejectUrl}</a></p>
            </div>
        `
    };
};

const sendOnboardingReviewEmail = async ({ req, user }) => {
    const emailData = resolveOnboardingEmailData(user);

    if (!emailData.email) {
        const error = new Error('This onboarding request is missing an email address and cannot be resent.');
        error.statusCode = 400;
        throw error;
    }

    const approveToken = createApprovalEmailActionToken({
        userId: user._id.toString(),
        decision: EMAIL_ACTION_DECISIONS.APPROVE
    });
    const rejectToken = createApprovalEmailActionToken({
        userId: user._id.toString(),
        decision: EMAIL_ACTION_DECISIONS.REJECT
    });
    const approveUrl = buildApprovalActionUrl({ req, token: approveToken });
    const rejectUrl = buildApprovalActionUrl({ req, token: rejectToken });

    const emailPayload = buildOnboardingEmail({
        name: emailData.name,
        phone: emailData.phone,
        email: emailData.email,
        comment: emailData.comment,
        planName: emailData.planName,
        billingCycle: emailData.billingCycle,
        approveUrl,
        rejectUrl
    });

    await sendMail({
        to: REVIEW_RECIPIENT,
        subject: emailPayload.subject,
        text: emailPayload.text,
        html: emailPayload.html
    });
};

exports.selectPlan = async (req, res) => {
    try {
        const { managerId, plan, planName, billingCycle } = req.body;
        const selectedPlan = plan || planName;

        console.log('[plans/select] request', {
            managerId,
            plan: selectedPlan,
            billingCycle
        });

        if (!managerId || !selectedPlan) {
            return res.status(400).json({
                success: false,
                message: 'managerId and plan are required'
            });
        }

        if (req.user.id !== managerId) {
            return res.status(403).json({
                success: false,
                message: 'Only the manager can modify the subscription'
            });
        }

        const snapshot = await selectManagerPlan({
            managerId,
            planName: selectedPlan,
            billingCycle
        });

        res.status(200).json({
            success: true,
            message: 'Plan saved',
            plan: snapshot.plan?.name || null,
            planDetails: snapshot
        });
    } catch (err) {
        console.error('Select plan error:', err.message);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to save selected plan'
        });
    }
};

exports.getCurrentPlan = async (req, res) => {
    try {
        const snapshot = await checkUserPlan(req.user.id);
        res.json({
            success: true,
            plan: snapshot.plan?.name || null,
            planDetails: snapshot
        });
    } catch (err) {
        console.error('Get current plan error:', err.message);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to fetch plan'
        });
    }
};

exports.getPlanCheck = async (req, res) => {
    try {
        const requestedUserId = req.params.userId;
        console.log('[plans/check] request', { userId: requestedUserId });

        if (requestedUserId !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to check this subscription'
            });
        }

        const snapshot = await checkUserPlan(requestedUserId);
        res.json({
            success: true,
            plan: snapshot.plan?.name || null,
            planDetails: snapshot
        });
    } catch (err) {
        console.error('Check plan error:', err.message);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to check plan'
        });
    }
};

exports.submitOnboardingRequest = async (req, res) => {
    try {
        const { name, phone, email, comment, plan, planName, billingCycle } = req.body;
        const selectedPlan = plan || planName;
        const normalizedEmail = email?.trim().toLowerCase();
        const normalizedName = name?.trim();
        const normalizedPhone = phone?.trim();
        const normalizedComment = comment?.trim();

        if (!normalizedName || !normalizedPhone || !normalizedEmail || !normalizedComment || !selectedPlan) {
            return res.status(400).json({
                success: false,
                message: 'Name, phone number, email, comment, and selected plan are required'
            });
        }

        if (!req.user.requiresApproval) {
            return res.status(400).json({
                success: false,
                message: 'This account does not require onboarding approval'
            });
        }

        if (normalizedEmail !== req.user.email) {
            return res.status(400).json({
                success: false,
                message: 'Please use the email address linked to your account'
            });
        }

        const approvalStatus = getApprovalStatus(req.user);
        if (approvalStatus === APPROVAL_STATUS.PENDING) {
            return res.status(400).json({
                success: false,
                message: 'Your account is already under review.'
            });
        }

        if (approvalStatus === APPROVAL_STATUS.REJECTED) {
            return res.status(403).json({
                success: false,
                message: 'Your access request has been rejected.'
            });
        }

        const planDefinition = getPlanDefinition(selectedPlan);
        if (!planDefinition) {
            return res.status(400).json({
                success: false,
                message: 'Invalid pricing plan selected'
            });
        }

        req.user.name = normalizedName;
        req.user.phone = normalizedPhone;
        req.user.requestedPlanName = planDefinition.name;
        req.user.requestedBillingCycle = normalizeBillingCycle(billingCycle);
        req.user.requestedComment = normalizedComment;
        req.user.approvalStatus = APPROVAL_STATUS.PENDING;
        req.user.approvalRequestedAt = new Date();
        req.user.approvalReviewedAt = null;
        req.user.approvalReviewedBy = null;
        await req.user.save();

        let emailSent = true;
        try {
            await sendOnboardingReviewEmail({
                req,
                user: req.user
            });
        } catch (mailError) {
            emailSent = false;
            console.error('Onboarding request email failed:', mailError.message);
        }

        res.status(200).json({
            success: true,
            message: 'Your account is under review. Please wait for approval.',
            approvalStatus: APPROVAL_STATUS.PENDING,
            emailSent
        });
    } catch (err) {
        console.error('Submit onboarding request error:', err.message);
        res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to submit onboarding request'
        });
    }
};

exports.resendOnboardingRequest = async (req, res) => {
    try {
        const normalizedEmail = req.body?.email?.trim().toLowerCase();

        if (!normalizedEmail) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const User = require('../models/User');
        const user = await User.findOne({ email: normalizedEmail });

        if (!user || getApprovalStatus(user) !== APPROVAL_STATUS.PENDING) {
            return res.status(400).json({
                success: false,
                message: 'Your account is not currently awaiting approval.'
            });
        }

        await sendOnboardingReviewEmail({ req, user });

        return res.status(200).json({
            success: true,
            message: 'Request sent again successfully.'
        });
    } catch (err) {
        console.error('Resend onboarding request error:', err.message);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message || 'Failed to resend onboarding request'
        });
    }
};
