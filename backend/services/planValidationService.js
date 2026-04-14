const { checkUserPlan } = require('./planService');

const UPGRADE_MESSAGE = 'Upgrade your plan to continue';

const createPlanError = (message, code, snapshot, statusCode = 403) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    error.snapshot = snapshot;
    return error;
};

const ensurePlanSelected = async (userId) => {
    const snapshot = await checkUserPlan(userId);
    if (!snapshot.plan) {
        throw createPlanError('Select a pricing plan to continue', 'PLAN_REQUIRED', snapshot);
    }

    return snapshot;
};

const validatePlanFeatureAccess = async (userId, featureKey) => {
    const snapshot = await ensurePlanSelected(userId);

    if (!snapshot.features[featureKey] && !snapshot.features.all) {
        throw createPlanError(UPGRADE_MESSAGE, 'PLAN_FEATURE_LOCKED', snapshot);
    }

    return snapshot;
};

const validateTeamMemberLimit = async (userId, additionalMembers = 1) => {
    const snapshot = await ensurePlanSelected(userId);
    const limit = snapshot.limits?.teamMembers;

    if (limit !== null && snapshot.usage.teamMembersUsed + additionalMembers > limit) {
        throw createPlanError(UPGRADE_MESSAGE, 'PLAN_TEAM_LIMIT_REACHED', snapshot);
    }

    return snapshot;
};

const validateStorageLimit = async (userId, additionalBytes = 0) => {
    const snapshot = await ensurePlanSelected(userId);
    const limit = snapshot.limits?.storageBytes;

    if (limit !== null && snapshot.usage.storageUsedBytes + additionalBytes > limit) {
        throw createPlanError(UPGRADE_MESSAGE, 'PLAN_STORAGE_LIMIT_REACHED', snapshot);
    }

    return snapshot;
};

module.exports = {
    UPGRADE_MESSAGE,
    validatePlanFeatureAccess,
    validateTeamMemberLimit,
    validateStorageLimit
};
