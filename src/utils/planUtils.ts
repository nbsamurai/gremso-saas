import type { BillingCycle, PlanFeatureKey, PlanName, PlanSnapshot } from '../types/plan';

type PlanDefinition = {
  name: PlanName;
  label: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  description: string;
  teamMemberLimit: number | null;
  storageLimitBytes: number | null;
  featureHighlights: string[];
};

const GB = 1024 * 1024 * 1024;

export const PLAN_DEFINITIONS: Record<PlanName, PlanDefinition> = {
  starter: {
    name: 'starter',
    label: 'Starter',
    monthlyPrice: 49,
    yearlyPrice: 470,
    description: 'Best for smaller teams that need the core workspace tools.',
    teamMemberLimit: 5,
    storageLimitBytes: 10 * GB,
    featureHighlights: ['Up to 5 team members', '10GB storage', 'Basic workspace features']
  },
  professional: {
    name: 'professional',
    label: 'Professional',
    monthlyPrice: 100,
    yearlyPrice: 960,
    description: 'Built for growing teams that need advanced collaboration.',
    teamMemberLimit: 20,
    storageLimitBytes: 100 * GB,
    featureHighlights: ['Up to 20 team members', '100GB storage', 'Meetings and private notes']
  },
  premium_plus: {
    name: 'premium_plus',
    label: 'Premium Plus',
    monthlyPrice: 199,
    yearlyPrice: 1910,
    description: 'For larger teams that need unlimited scale and full access.',
    teamMemberLimit: null,
    storageLimitBytes: null,
    featureHighlights: ['Unlimited team members', 'Unlimited storage', 'All features enabled']
  }
};

export const formatStorage = (bytes: number | null) => {
  if (bytes === null) {
    return 'Unlimited';
  }

  const valueInGb = bytes / GB;
  return `${valueInGb.toFixed(valueInGb % 1 === 0 ? 0 : 1)}GB`;
};

export const formatPrice = (planName: PlanName, billingCycle: BillingCycle) => {
  const plan = PLAN_DEFINITIONS[planName];
  const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

  if (price === null) {
    return { value: 'Custom', period: '', original: null as string | null };
  }

  if (billingCycle === 'yearly') {
    const originalPrice = plan.monthlyPrice ? plan.monthlyPrice * 12 : null;
    return {
      value: `€${price}`,
      period: '/year',
      original: originalPrice ? `€${originalPrice}` : null
    };
  }

  return {
    value: `€${price}`,
    period: '/month',
    original: null as string | null
  };
};

export const getPlanLabel = (planName?: PlanName | null) =>
  planName ? PLAN_DEFINITIONS[planName].label : 'No Plan Selected';

export const hasFeatureAccess = (planSnapshot: PlanSnapshot | null, featureKey: PlanFeatureKey) =>
  Boolean(planSnapshot?.features?.all || planSnapshot?.features?.[featureKey]);

export const isLimitReached = (used: number, limit: number | null) =>
  limit !== null && used >= limit;

export const willExceedLimit = (used: number, limit: number | null, increment: number) =>
  limit !== null && used + increment > limit;
