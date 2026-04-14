import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { BillingCycle, PlanName, PlanSnapshot } from '../types/plan';
import {
  cachePlanSnapshot,
  clearAllPlanStorage,
  clearCachedPlanSnapshot,
  getCachedPlanSnapshot,
  getStoredUserId,
  getUserPlan,
  selectPlan as persistPlanSelection,
} from '../services/planService';

type PlanContextValue = {
  planSnapshot: PlanSnapshot | null;
  isLoading: boolean;
  isSaving: boolean;
  refreshPlan: () => Promise<PlanSnapshot | null>;
  selectPlan: (planName: PlanName, billingCycle: BillingCycle) => Promise<PlanSnapshot>;
  clearPlan: () => void;
};

const PlanContext = createContext<PlanContextValue | undefined>(undefined);

export function PlanProvider({ children }: { children: ReactNode }) {
  const [planSnapshot, setPlanSnapshot] = useState<PlanSnapshot | null>(() => getCachedPlanSnapshot());
  const [isLoading, setIsLoading] = useState(Boolean(localStorage.getItem('token') && getStoredUserId()));
  const [isSaving, setIsSaving] = useState(false);

  const hasPendingApproval = () => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return false;
    }

    try {
      const storedUser = JSON.parse(userJson);
      return Boolean(storedUser?.requiresApproval && storedUser?.approvalStatus !== 'approved');
    } catch {
      return false;
    }
  };

  const clearPlan = useCallback(() => {
    setPlanSnapshot(null);
    clearAllPlanStorage();
  }, []);

  const refreshPlan = useCallback(async () => {
    const userId = getStoredUserId();
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      clearPlan();
      return null;
    }

    if (hasPendingApproval()) {
      setPlanSnapshot(null);
      clearCachedPlanSnapshot();
      return null;
    }

    setIsLoading(true);
    try {
      const nextPlanSnapshot = await getUserPlan(userId);
      setPlanSnapshot(nextPlanSnapshot);
      cachePlanSnapshot(nextPlanSnapshot);
      return nextPlanSnapshot;
    } catch (error) {
      console.error('[PlanContext] Failed to refresh plan snapshot', error);
      const cachedPlanSnapshot = getCachedPlanSnapshot();
      if (cachedPlanSnapshot) {
        setPlanSnapshot(cachedPlanSnapshot);
        return cachedPlanSnapshot;
      }

      return null;
    } finally {
      setIsLoading(false);
    }
  }, [clearPlan]);

  const selectPlan = useCallback(async (planName: PlanName, billingCycle: BillingCycle) => {
    const userId = getStoredUserId();
    if (!userId) {
      throw new Error('User not found');
    }

    setIsSaving(true);
    try {
      const nextPlanSnapshot = await persistPlanSelection(userId, planName, billingCycle);
      setPlanSnapshot(nextPlanSnapshot);
      return nextPlanSnapshot;
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    const userId = getStoredUserId();
    const token = localStorage.getItem('token');

    if (!userId || !token) {
      setIsLoading(false);
      clearPlan();
      return;
    }

    if (hasPendingApproval()) {
      setIsLoading(false);
      setPlanSnapshot(null);
      clearCachedPlanSnapshot();
      return;
    }

    refreshPlan();
  }, [clearPlan, refreshPlan]);

  const value = useMemo(
    () => ({
      planSnapshot,
      isLoading,
      isSaving,
      refreshPlan,
      selectPlan,
      clearPlan,
    }),
    [planSnapshot, isLoading, isSaving, refreshPlan, selectPlan, clearPlan]
  );

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error('usePlan must be used within PlanProvider');
  }

  return context;
};
