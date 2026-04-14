import api from '../lib/api';
import type { BillingCycle, PendingPlanSelection, PlanFeatureFlags, PlanName, PlanSnapshot } from '../types/plan';
import { PLAN_DEFINITIONS } from '../utils/planUtils';
import { isManagerRole } from '../utils/roleUtils';

const PLAN_CACHE_KEY = 'planSnapshot';
const PENDING_PLAN_KEY = 'pendingPlanSelection';

const EMPTY_FEATURES: PlanFeatureFlags = {
  dashboard: false,
  projects: false,
  tasks: false,
  documents: false,
  team: false,
  meetings: false,
  privateNotes: false,
  basic: false,
  advanced: false,
  all: false,
};

const parseStoredJson = <T>(key: string): T | null => {
  const rawValue = localStorage.getItem(key);
  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

const buildFeatureFlags = (planName: PlanName | null): PlanFeatureFlags => {
  if (!planName) {
    return EMPTY_FEATURES;
  }

  const baseFlags: PlanFeatureFlags = {
    ...EMPTY_FEATURES,
    dashboard: true,
    projects: true,
    tasks: true,
    documents: true,
    team: true,
    basic: true,
  };

  if (planName === 'professional' || planName === 'premium_plus') {
    baseFlags.meetings = true;
    baseFlags.privateNotes = true;
    baseFlags.advanced = true;
  }

  if (planName === 'premium_plus') {
    baseFlags.all = true;
  }

  return baseFlags;
};

const normalizeBillingCycle = (billingCycle: unknown): BillingCycle =>
  billingCycle === 'yearly' ? 'yearly' : 'monthly';

const updateStoredUserPlan = (planSnapshot: PlanSnapshot | null) => {
  const currentUser = getStoredUser();
  if (!currentUser) {
    return;
  }

  const nextUser = {
    ...currentUser,
    planName: planSnapshot?.plan?.name ?? null,
    billingCycle: planSnapshot?.plan?.billingCycle ?? null,
    managerId: planSnapshot?.managerId ?? currentUser.managerId ?? null,
  };

  localStorage.setItem('user', JSON.stringify(nextUser));
};

const buildFallbackSnapshot = (
  userId: string,
  role: string | null,
  planName: PlanName | null,
  billingCycle: BillingCycle | null,
  managerId: string | null
): PlanSnapshot => {
  const planDefinition = planName ? PLAN_DEFINITIONS[planName] : null;

  return {
    userId,
    teamId: null,
    managerId,
    plan: planDefinition
      ? {
          id: `${userId}-${planName}`,
          name: planDefinition.name,
          label: planDefinition.label,
          planStatus: 'active',
          billingCycle: normalizeBillingCycle(billingCycle),
        }
      : null,
    usage: {
      teamMembersUsed: 0,
      storageUsedBytes: 0,
    },
    limits: planDefinition
      ? {
          teamMembers: planDefinition.teamMemberLimit,
          storageBytes: planDefinition.storageLimitBytes,
        }
      : null,
    features: buildFeatureFlags(planName),
    canManageSubscription: isManagerRole(role),
  };
};

const getStoredUser = () => {
  const userJson = localStorage.getItem('user');
  if (!userJson) {
    return null;
  }

  try {
    return JSON.parse(userJson);
  } catch {
    return null;
  }
};

export const getStoredUserId = () => getStoredUser()?.id || null;

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
});

const normalizePlanResponse = (userId: string, responseData: any): PlanSnapshot => {
  if (responseData?.planDetails) {
    return responseData.planDetails as PlanSnapshot;
  }

  const currentUser = getStoredUser();
  const planName = (responseData?.plan ?? currentUser?.planName ?? null) as PlanName | null;
  const billingCycle = (responseData?.billingCycle ?? currentUser?.billingCycle ?? null) as BillingCycle | null;
  const managerId = (responseData?.managerId ?? currentUser?.managerId ?? null) as string | null;

  return buildFallbackSnapshot(userId, currentUser?.role || null, planName, billingCycle, managerId);
};

export const getCachedPlanSnapshot = () => parseStoredJson<PlanSnapshot>(PLAN_CACHE_KEY);

export const cachePlanSnapshot = (planSnapshot: PlanSnapshot | null) => {
  if (!planSnapshot) {
    localStorage.removeItem(PLAN_CACHE_KEY);
    return;
  }

  localStorage.setItem(PLAN_CACHE_KEY, JSON.stringify(planSnapshot));
  updateStoredUserPlan(planSnapshot);
};

export const clearCachedPlanSnapshot = () => {
  localStorage.removeItem(PLAN_CACHE_KEY);
};

export const savePendingPlanSelection = (selection: PendingPlanSelection) => {
  localStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(selection));
};

export const getPendingPlanSelection = () => parseStoredJson<PendingPlanSelection>(PENDING_PLAN_KEY);

export const clearPendingPlanSelection = () => {
  localStorage.removeItem(PENDING_PLAN_KEY);
};

export const selectPlan = async (
  managerId: string,
  planName: PlanName,
  billingCycle: BillingCycle = 'monthly'
): Promise<PlanSnapshot> => {
  console.log('[planService] POST /api/plans/select', { managerId, plan: planName, billingCycle });
  const response = await api.post(
    '/plans/select',
    {
      managerId,
      plan: planName,
      billingCycle,
    },
    getAuthConfig()
  );
  console.log('[planService] select response', response.data);

  const planSnapshot = normalizePlanResponse(managerId, response.data);
  cachePlanSnapshot(planSnapshot);
  clearPendingPlanSelection();
  return planSnapshot;
};

export const submitOnboardingRequest = async ({
  planName,
  billingCycle,
  name,
  phone,
  email,
  comment,
}: {
  planName: PlanName;
  billingCycle: BillingCycle;
  name: string;
  phone: string;
  email: string;
  comment: string;
}) => {
  const response = await api.post(
    '/plans/onboarding-request',
    {
      plan: planName,
      billingCycle,
      name,
      phone,
      email,
      comment,
    },
    getAuthConfig()
  );

  return response.data;
};

export async function getUserPlan(userId: string): Promise<PlanSnapshot> {
  console.log(`[planService] GET /api/plans/check/${userId}`);
  const response = await api.get(`/plans/check/${userId}`, getAuthConfig());
  console.log('[planService] check response', response.data);

  const planSnapshot = normalizePlanResponse(userId, response.data);
  cachePlanSnapshot(planSnapshot);
  return planSnapshot;
}

export async function checkUserPlan(userId: string): Promise<PlanSnapshot> {
  return getUserPlan(userId);
}

export const syncPendingPlanSelection = async (userId: string) => {
  const pendingSelection = getPendingPlanSelection();
  if (!pendingSelection) {
    return null;
  }

  return selectPlan(userId, pendingSelection.planName, pendingSelection.billingCycle);
};

export const clearAllPlanStorage = () => {
  clearCachedPlanSnapshot();
  clearPendingPlanSelection();
};
