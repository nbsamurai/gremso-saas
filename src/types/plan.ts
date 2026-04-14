export type PlanName = 'starter' | 'professional' | 'premium_plus';
export type BillingCycle = 'monthly' | 'yearly';

export type PlanFeatureKey =
  | 'dashboard'
  | 'projects'
  | 'tasks'
  | 'documents'
  | 'team'
  | 'meetings'
  | 'privateNotes'
  | 'basic'
  | 'advanced'
  | 'all';

export type PlanFeatureFlags = Record<PlanFeatureKey, boolean>;

export interface ActivePlan {
  id: string;
  name: PlanName;
  label: string;
  planStatus: 'active';
  billingCycle: BillingCycle;
}

export interface PlanUsage {
  teamMembersUsed: number;
  storageUsedBytes: number;
}

export interface PlanLimits {
  teamMembers: number | null;
  storageBytes: number | null;
}

export interface PlanSnapshot {
  userId: string | null;
  teamId?: string | null;
  managerId?: string | null;
  plan: ActivePlan | null;
  usage: PlanUsage;
  limits: PlanLimits | null;
  features: PlanFeatureFlags;
  canManageSubscription?: boolean;
}

export interface PendingPlanSelection {
  planName: PlanName;
  billingCycle: BillingCycle;
}
