import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PlanSelectionCard from '../components/PlanSelectionCard';
import { usePlan } from '../context/PlanContext';
import {
  clearPendingPlanSelection,
  getPendingPlanSelection,
  savePendingPlanSelection,
  submitOnboardingRequest,
} from '../services/planService';
import { authService } from '../services/authService';
import type { BillingCycle, PlanName } from '../types/plan';
import { PLAN_DEFINITIONS, formatPrice, getPlanLabel } from '../utils/planUtils';
import { isManagerRole } from '../utils/roleUtils';

export default function Pricing() {
  const navigate = useNavigate();
  const { planSnapshot, selectPlan, clearPlan, isLoading, isSaving } = usePlan();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlanName, setSelectedPlanName] = useState<PlanName | null>(null);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  const isAuthenticatedNonManager = Boolean(user) && !isManagerRole(user?.role);
  const pendingPlanSelection = useMemo(() => getPendingPlanSelection(), []);
  const canSubmitApprovalRequest = Boolean(user?.requiresApproval && user?.approvalStatus === 'not_submitted');
  const [onboardingForm, setOnboardingForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    comment: '',
  });

  useEffect(() => {
    if (isAuthenticatedNonManager) {
      navigate('/dashboard', { replace: true });
      return;
    }

    if (planSnapshot?.plan) {
      setBillingCycle(planSnapshot.plan.billingCycle);
      setSelectedPlanName(planSnapshot.plan.name);
      return;
    }

    if (!isLoading) {
      setSelectedPlanName((currentPlanName) => currentPlanName ?? pendingPlanSelection?.planName ?? 'starter');
      if (pendingPlanSelection?.billingCycle) {
        setBillingCycle(pendingPlanSelection.billingCycle);
      }
    }
  }, [isAuthenticatedNonManager, isLoading, navigate, pendingPlanSelection, planSnapshot]);

  useEffect(() => {
    if (canSubmitApprovalRequest && pendingPlanSelection?.planName) {
      setShowOnboardingModal(true);
    }
  }, [canSubmitApprovalRequest, pendingPlanSelection]);

  const handlePlanSelection = async (planName: PlanName) => {
    setSelectedPlanName(planName);

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      savePendingPlanSelection({ planName, billingCycle });
      toast.success('Plan selected. Create your account to continue.');
      navigate('/signup');
      return;
    }

    if (canSubmitApprovalRequest) {
      savePendingPlanSelection({ planName, billingCycle });
      setShowOnboardingModal(true);
      return;
    }

    try {
      await selectPlan(planName, billingCycle);
      toast.success(`${getPlanLabel(planName)} plan activated`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to activate the selected plan');
    }
  };

  const handleOnboardingSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedPlanName) {
      toast.error('Please select a plan to continue.');
      return;
    }

    if (!onboardingForm.name.trim() || !onboardingForm.phone.trim() || !onboardingForm.email.trim() || !onboardingForm.comment.trim()) {
      toast.error('Please complete all onboarding details.');
      return;
    }

    setIsSubmittingRequest(true);
    try {
      await submitOnboardingRequest({
        planName: selectedPlanName,
        billingCycle,
        name: onboardingForm.name.trim(),
        phone: onboardingForm.phone.trim(),
        email: onboardingForm.email.trim(),
        comment: onboardingForm.comment.trim(),
      });
      clearPendingPlanSelection();
      clearPlan();
      await authService.logout();
      toast.success('Your account is under review. Please wait for approval.');
      navigate('/login', { replace: true });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit your approval request');
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const pricingPlans: PlanName[] = ['starter', 'professional', 'premium_plus'];

  return (
    <div className="min-h-screen bg-[#F6F3EE]">
      <Navbar />

      <main className="px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] border border-[#E5DED6] bg-gradient-to-br from-white via-[#F9F6F1] to-[#EFE9E1] p-8 shadow-sm sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#2563EB]">
                Pricing Plans
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-[#1F2937] sm:text-5xl">
                Pick the workspace plan that fits your team today
              </h1>
              <p className="mt-5 text-base leading-7 text-[#6B7280] sm:text-lg">
                Choose the plan that fits your workspace. New self-serve accounts will submit their details for admin review before access is enabled.
              </p>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>
                  Monthly
                </span>
                <button
                  type="button"
                  onClick={() => setBillingCycle((current) => (current === 'monthly' ? 'yearly' : 'monthly'))}
                  className="relative inline-flex h-7 w-12 items-center rounded-full bg-[#2563EB] transition-colors"
                  aria-label="Toggle billing cycle"
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-[#1F2937]' : 'text-[#6B7280]'}`}>
                    Yearly
                  </span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-[#1F2937] ring-1 ring-[#E5DED6]">
                    Save 20%
                  </span>
                </div>
              </div>

              {planSnapshot?.plan && (
                <div className="rounded-full bg-white px-4 py-2 text-sm text-[#6B7280] ring-1 ring-[#E5DED6]">
                  Current plan: <span className="font-semibold text-[#1F2937]">{planSnapshot.plan.label}</span>
                </div>
              )}

              {canSubmitApprovalRequest && (
                <div className="rounded-2xl border border-[#D7C7B3] bg-[#FFF7ED] px-5 py-4 text-sm text-[#6B7280]">
                  Select a plan and submit your onboarding details. Access will be enabled after an admin approves your request.
                </div>
              )}
            </div>
          </section>

          <section className="mt-10 grid grid-cols-1 gap-8 xl:grid-cols-3">
            {pricingPlans.map((planName) => {
              const planDefinition = PLAN_DEFINITIONS[planName];
              const price = formatPrice(planName, billingCycle);
              const isCurrent = planSnapshot?.plan?.name === planName;
              const isSelected = selectedPlanName === planName;

              return (
                <PlanSelectionCard
                  key={planName}
                  name={planDefinition.label}
                  price={price.value}
                  originalPrice={price.original}
                  period={price.period}
                  description={planDefinition.description}
                  features={planDefinition.featureHighlights}
                  popular={planName === 'professional'}
                  isCurrent={isCurrent}
                  isSelected={isSelected}
                  isLoading={isSaving || isSubmittingRequest}
                  ctaLabel={isCurrent ? 'Current Plan' : 'Get Started'}
                  onSelect={() => handlePlanSelection(planName)}
                />
              );
            })}
          </section>
        </div>
      </main>

      {showOnboardingModal && selectedPlanName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[28px] border border-[#E5DED6] bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#2563EB]">Approval Request</p>
              <h2 className="mt-2 text-2xl font-bold text-[#1F2937]">Submit your onboarding details</h2>
              <p className="mt-2 text-sm text-[#6B7280]">
                Selected plan: <span className="font-semibold text-[#1F2937]">{getPlanLabel(selectedPlanName)}</span> ({billingCycle === 'yearly' ? 'Yearly' : 'Monthly'})
              </p>
            </div>

            <form onSubmit={handleOnboardingSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2937]">Name</label>
                <input
                  type="text"
                  value={onboardingForm.name}
                  onChange={(event) => setOnboardingForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-xl border border-[#E5DED6] px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2937]">Phone Number</label>
                <input
                  type="text"
                  value={onboardingForm.phone}
                  onChange={(event) => setOnboardingForm((current) => ({ ...current, phone: event.target.value }))}
                  className="w-full rounded-xl border border-[#E5DED6] px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Your phone number"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2937]">Email</label>
                <input
                  type="email"
                  value={onboardingForm.email}
                  onChange={(event) => setOnboardingForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-xl border border-[#E5DED6] bg-[#F9F7F3] px-4 py-3 text-[#6B7280] outline-none"
                  readOnly
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1F2937]">Comment</label>
                <textarea
                  value={onboardingForm.comment}
                  onChange={(event) => setOnboardingForm((current) => ({ ...current, comment: event.target.value }))}
                  className="min-h-28 w-full rounded-xl border border-[#E5DED6] px-4 py-3 outline-none transition focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Tell the admin a bit about your team, use case, or onboarding needs"
                  required
                />
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setShowOnboardingModal(false)}
                  className="rounded-xl px-4 py-3 text-[#6B7280] transition hover:bg-[#EFE9E1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRequest}
                  className="rounded-xl bg-[#2563EB] px-5 py-3 font-medium text-white transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-[#A5B4D4]"
                >
                  {isSubmittingRequest ? 'Submitting...' : 'Submit for approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
