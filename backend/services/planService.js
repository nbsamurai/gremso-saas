const Document = require('../models/Document');
const TeamMember = require('../models/TeamMember');
const Workspace = require('../models/Workspace');
const User = require('../models/User');
const { DEFAULT_BILLING_CYCLE, getPlanDefinition, normalizePlanName } = require('../config/plans');
const { getTeamForUser, isManagerRole } = require('./teamService');

const normalizeBillingCycle = (billingCycle) => (billingCycle === 'yearly' ? 'yearly' : DEFAULT_BILLING_CYCLE);

const getStoredPlanName = (entity) => {
    if (!entity?.planName) {
        return null;
    }

    return getPlanDefinition(entity.planName) ? normalizePlanName(entity.planName) : null;
};

const sumStorageForWorkspace = async (workspaceId) => {
    if (!workspaceId) {
        return 0;
    }

    const [result] = await Document.aggregate([
        { $match: { workspaceId } },
        {
            $group: {
                _id: null,
                totalBytes: {
                    $sum: { $ifNull: ['$fileSizeBytes', 0] }
                }
            }
        }
    ]);

    return result?.totalBytes || 0;
};

const buildFeatureFlags = (features = []) => ({
    dashboard: features.includes('dashboard'),
    projects: features.includes('projects'),
    tasks: features.includes('tasks'),
    documents: features.includes('documents'),
    team: features.includes('team'),
    meetings: features.includes('meetings'),
    privateNotes: features.includes('privateNotes'),
    basic: features.includes('basic'),
    advanced: features.includes('advanced'),
    all: features.includes('all')
});

const buildPlanSnapshot = async ({ user, team }) => {
    const teamMembersUsed = team?._id
        ? await TeamMember.countDocuments({ teamId: team._id, status: { $ne: 'revoked' } })
        : 0;
    const storageUsedBytes = await sumStorageForWorkspace(team?._id);
    
    // Fetch manager to get the plan
    let manager = user;
    if (team?.owner && user?._id?.toString() !== team.owner.toString()) {
        manager = await User.findById(team.owner);
    } else if (user?.managerId && user?._id?.toString() !== user?.managerId?.toString()) {
        manager = await User.findById(user.managerId);
    }
    
    const currentPlanName = getStoredPlanName(manager) || getStoredPlanName(user) || getStoredPlanName(team) || null;
    const currentBillingCycle = currentPlanName
        ? normalizeBillingCycle(
              manager?.planName
                  ? manager?.billingCycle
                  : user?.planName
                    ? user?.billingCycle
                    : team?.billingCycle
          )
        : DEFAULT_BILLING_CYCLE;
    const planDefinition = currentPlanName ? getPlanDefinition(currentPlanName) : null;

    return {
        userId: user?._id?.toString() || null,
        teamId: team?._id?.toString() || null,
        managerId: team?.owner?.toString?.() || team?.owner?._id?.toString?.() || null,
        plan: planDefinition
            ? {
                  id: team?._id?.toString() || user?._id?.toString(),
                  name: planDefinition.name,
                  label: planDefinition.label,
                  planStatus: 'active',
                  billingCycle: currentBillingCycle
              }
            : null,
        usage: {
            teamMembersUsed,
            storageUsedBytes
        },
        limits: planDefinition
            ? {
                  teamMembers: planDefinition.teamMemberLimit,
                  storageBytes: planDefinition.storageLimitBytes
              }
            : null,
        features: buildFeatureFlags(planDefinition?.features || []),
        canManageSubscription: Boolean(user && isManagerRole(user.role) && team && team.owner.toString() === user._id.toString())
    };
};

const validateRequestedPlan = (planName, billingCycle = DEFAULT_BILLING_CYCLE) => {
    if (typeof planName !== 'string' || !planName.trim()) {
        const error = new Error('Cannot overwrite plan with null, undefined, or empty values');
        error.statusCode = 400;
        throw error;
    }

    const normalizedPlanName = normalizePlanName(planName);
    const planDefinition = getPlanDefinition(normalizedPlanName);
    const normalizedBillingCycle = normalizeBillingCycle(billingCycle);

    if (!planDefinition) {
        const error = new Error('Invalid pricing plan selected');
        error.statusCode = 400;
        throw error;
    }

    if (!normalizedPlanName || normalizedPlanName === 'default') {
        const error = new Error('Cannot overwrite plan with null, undefined, or default values');
        error.statusCode = 400;
        throw error;
    }

    return {
        normalizedPlanName,
        normalizedBillingCycle
    };
};

const persistManagerPlanSelection = async ({
    managerId,
    user,
    team,
    planName,
    billingCycle = DEFAULT_BILLING_CYCLE
}) => {
    const { normalizedPlanName, normalizedBillingCycle } = validateRequestedPlan(planName, billingCycle);

    console.log('[planService] Before saving user plan', {
        managerId,
        currentUserPlan: user.planName || null,
        currentUserBillingCycle: user.billingCycle || null,
        currentWorkspacePlan: team?.planName || null,
        currentWorkspaceBillingCycle: team?.billingCycle || null,
        nextPlanName: normalizedPlanName,
        nextBillingCycle: normalizedBillingCycle
    });

    user.planName = normalizedPlanName;
    user.billingCycle = normalizedBillingCycle;
    await user.save();

    if (team) {
        team.planName = normalizedPlanName;
        team.billingCycle = normalizedBillingCycle;
        await team.save();
    }

    console.log('[planService] After saving user plan', {
        managerId,
        savedUserPlan: user.planName || null,
        savedUserBillingCycle: user.billingCycle || null,
        savedWorkspacePlan: team?.planName || null,
        savedWorkspaceBillingCycle: team?.billingCycle || null
    });

    return buildPlanSnapshot({ user, team });
};

const selectManagerPlan = async ({ managerId, planName, billingCycle = DEFAULT_BILLING_CYCLE }) => {
    const { user, team, isTeamManager } = await getTeamForUser(managerId);

    if (!isTeamManager) {
        const error = new Error('Only the manager can manage the team subscription');
        error.statusCode = 403;
        throw error;
    }

    return persistManagerPlanSelection({
        managerId,
        user,
        team,
        planName,
        billingCycle
    });
};

const getUserPlanRecord = async (userId) => {
    const { team } = await getTeamForUser(userId);
    return team;
};

async function checkUserPlan(userId) {
    const { user, team } = await getTeamForUser(userId);
    return buildPlanSnapshot({ user, team });
}

module.exports = {
    selectManagerPlan,
    getUserPlanRecord,
    checkUserPlan,
    persistManagerPlanSelection,
    validateRequestedPlan
};
