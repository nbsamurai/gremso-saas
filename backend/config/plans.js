const PLAN_DEFINITIONS = {
    starter: {
        name: 'starter',
        label: 'Starter',
        monthlyPrice: 49,
        yearlyPrice: 470,
        teamMemberLimit: 5,
        storageLimitBytes: 10 * 1024 * 1024 * 1024,
        features: ['dashboard', 'projects', 'tasks', 'documents', 'team', 'basic']
    },
    professional: {
        name: 'professional',
        label: 'Professional',
        monthlyPrice: 100,
        yearlyPrice: 960,
        teamMemberLimit: 20,
        storageLimitBytes: 100 * 1024 * 1024 * 1024,
        features: ['dashboard', 'projects', 'tasks', 'documents', 'team', 'basic', 'meetings', 'privateNotes', 'advanced']
    },
    premium_plus: {
        name: 'premium_plus',
        label: 'Premium Plus',
        monthlyPrice: 199,
        yearlyPrice: 1910,
        teamMemberLimit: null,
        storageLimitBytes: null,
        features: ['dashboard', 'projects', 'tasks', 'documents', 'team', 'basic', 'meetings', 'privateNotes', 'advanced', 'all']
    }
};

const DEFAULT_BILLING_CYCLE = 'monthly';

const normalizePlanName = (planName = '') => {
    const normalized = planName.toString().trim().toLowerCase().replace(/\s+/g, '_');

    if (['399-plan', '399_plan', 'premium-plus', 'premiumplus', 'enterprise'].includes(normalized)) {
        return 'premium_plus';
    }

    return normalized;
};

const getPlanDefinition = (planName) => PLAN_DEFINITIONS[normalizePlanName(planName)] || null;

module.exports = {
    PLAN_DEFINITIONS,
    DEFAULT_BILLING_CYCLE,
    normalizePlanName,
    getPlanDefinition
};
