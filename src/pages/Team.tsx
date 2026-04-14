import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Plus, Trash2, Users, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import AppShell from '../components/AppShell';
import UpgradePrompt from '../components/UpgradePrompt';
import { usePlan } from '../context/PlanContext';
import { authService } from '../services/authService';
import api from '../lib/api';
import { getPlanLabel, isLimitReached } from '../utils/planUtils';
import { isManagerRole } from '../utils/roleUtils';

export default function Team() {
  const { planSnapshot, refreshPlan } = usePlan();
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
  const isManager = isManagerRole(user?.role);
  const isAdmin = user?.role === 'Admin';
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [onboardingRequests, setOnboardingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(isAdmin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [errorShown, setErrorShown] = useState(false);
  const [activeDecisionId, setActiveDecisionId] = useState<string | null>(null);

  const teamMemberLimit = planSnapshot?.limits?.teamMembers ?? null;
  const teamMembersUsed = planSnapshot?.usage.teamMembersUsed ?? teamMembers.length;
  const teamLimitReached = isLimitReached(teamMembersUsed, teamMemberLimit);

  if (!isManager) {
    return <Navigate to="/dashboard" replace />;
  }

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const fetchMembers = async () => {
    try {
      const res = await api.get('/team/members', getAuthConfig());
      setTeamMembers(res.data);
    } catch (err) {
      console.error(err);
      if (!errorShown) {
        toast.error('Failed to load team members');
        setErrorShown(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOnboardingRequests = async () => {
    if (!isAdmin) {
      return;
    }

    try {
      const res = await api.get('/users/onboarding-requests', getAuthConfig());
      setOnboardingRequests(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load onboarding requests');
    } finally {
      setRequestsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchOnboardingRequests();
  }, []);

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();

    if (teamLimitReached) {
      toast.error('Upgrade your plan to continue');
      return;
    }

    try {
      const token = localStorage.getItem('token') || '';
      await authService.inviteTeamMember(newEmail, newName, newPhone, token);
      toast.success('Invitation sent successfully');
      setIsModalOpen(false);
      setNewName('');
      setNewEmail('');
      setNewPhone('');
      await fetchMembers();
      await refreshPlan();
    } catch (err: any) {
      let errorMessage = err.response?.data?.message || err.message || 'Failed to add member';

      if (err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format.';
      } else if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }

      toast.error(errorMessage);
      await refreshPlan();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this team member? This cannot be undone.')) return;

    try {
      await api.delete(`/team/member/${id}`, getAuthConfig());
      toast.success('Member removed');
      await fetchMembers();
      await refreshPlan();
    } catch {
      toast.error('Failed to remove member');
    }
  };

  const handleApprovalDecision = async (userId: string, decision: 'approve' | 'reject') => {
    try {
      setActiveDecisionId(`${userId}:${decision}`);
      await api.patch(`/users/${userId}/approval`, { decision }, getAuthConfig());
      toast.success(decision === 'approve' ? 'User approved successfully' : 'User rejected successfully');
      await fetchOnboardingRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update approval status');
    } finally {
      setActiveDecisionId(null);
    }
  };

  const getApprovalBadgeClass = (status: string) => {
    if (status === 'rejected') {
      return 'border-red-200 bg-red-50 text-red-700';
    }

    if (status === 'approved') {
      return 'border-green-200 bg-green-50 text-green-700';
    }

    return 'border-amber-200 bg-amber-50 text-amber-700';
  };

  return (
    <AppShell>
      {isAdmin && (
        <div className="mb-8 rounded-xl border border-[#E5DED6] bg-white p-6 shadow-sm">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#1F2937]">Access Approval Requests</h2>
              <p className="text-sm text-[#6B7280]">
                Review new self-serve signups before they get workspace access.
              </p>
            </div>
            <div className="rounded-full bg-[#F6F3EE] px-4 py-2 text-sm text-[#6B7280]">
              Pending: <span className="font-semibold text-[#1F2937]">{onboardingRequests.filter((request) => request.approvalStatus === 'pending').length}</span>
            </div>
          </div>

          {requestsLoading ? (
            <div className="py-8 text-center text-[#6B7280]">Loading approval requests...</div>
          ) : onboardingRequests.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#E5DED6] bg-[#F9F7F3] p-8 text-center text-[#6B7280]">
              No onboarding requests are waiting for review.
            </div>
          ) : (
            <div className="space-y-4">
              {onboardingRequests.map((request) => {
                const isApproveLoading = activeDecisionId === `${request._id}:approve`;
                const isRejectLoading = activeDecisionId === `${request._id}:reject`;

                return (
                  <div key={request._id} className="rounded-2xl border border-[#E5DED6] bg-[#FCFBF8] p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-[#1F2937]">{request.name}</h3>
                          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getApprovalBadgeClass(request.approvalStatus)}`}>
                            {request.approvalStatus === 'pending' ? 'Pending Review' : request.approvalStatus === 'rejected' ? 'Rejected' : 'Approved'}
                          </span>
                        </div>
                        <div className="grid gap-2 text-sm text-[#6B7280] sm:grid-cols-2">
                          <p>Email: <span className="text-[#1F2937]">{request.email}</span></p>
                          <p>Phone: <span className="text-[#1F2937]">{request.phone || 'N/A'}</span></p>
                          <p>Plan: <span className="text-[#1F2937]">{getPlanLabel(request.requestedPlanName)}</span></p>
                          <p>Billing: <span className="text-[#1F2937]">{request.requestedBillingCycle === 'yearly' ? 'Yearly' : 'Monthly'}</span></p>
                        </div>
                        <div className="rounded-xl border border-[#E5DED6] bg-white p-4 text-sm text-[#6B7280]">
                          <p className="mb-1 font-medium text-[#1F2937]">Comment</p>
                          <p>{request.requestedComment || 'No comment provided.'}</p>
                        </div>
                        <p className="text-xs uppercase tracking-[0.2em] text-[#9CA3AF]">
                          Submitted {new Date(request.approvalRequestedAt || request.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                        <button
                          type="button"
                          onClick={() => handleApprovalDecision(request._id, 'approve')}
                          disabled={isApproveLoading}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-green-400"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {isApproveLoading ? 'Approving...' : 'Approve'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApprovalDecision(request._id, 'reject')}
                          disabled={isRejectLoading}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <XCircle className="h-4 w-4" />
                          {isRejectLoading ? 'Rejecting...' : 'Reject'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-[#1F2937] sm:text-3xl">Team Directory</h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            Manage members and their roles across the company. Current usage: {teamMembersUsed} / {teamMemberLimit ?? 'Unlimited'} seats.
          </p>
        </div>
        {teamLimitReached ? (
          <Link
            to="/pricing"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#1F2937] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#111827] sm:w-auto"
          >
            Upgrade Plan
          </Link>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#1D4ED8] sm:w-auto"
          >
            <Plus className="h-5 w-5" /> Invite Member
          </button>
        )}
      </div>

      {teamLimitReached && (
        <div className="mb-6">
          <UpgradePrompt compact message="You have reached your team member limit. Upgrade to add more people." />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-[#E5DED6] bg-white shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-[#6B7280]">Loading...</div>
        ) : teamMembers.length === 0 ? (
          <div className="p-12 text-center text-[#6B7280]">
            <Users className="mx-auto mb-4 h-12 w-12 text-[#E5DED6]" />
            No team members found.
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="border-b border-[#E5DED6] bg-[#EFE9E1]">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-[#6B7280]">Name</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#6B7280]">Role</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#6B7280]">Contact</th>
                    <th className="px-6 py-4 text-sm font-semibold text-[#6B7280]">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-[#6B7280]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5DED6]">
                  {teamMembers.map((member) => (
                    <tr key={member._id} className="transition-colors hover:bg-[#F6F3EE]">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] font-bold text-white">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#1F2937]">{member.name}</p>
                            <p className="text-xs text-[#6B7280]">{member.email}</p>
                            {member.status === 'invited' ? (
                              <p className="text-xs font-medium text-[#C0841A]">Invitation pending</p>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full border border-[#E5DED6] bg-[#EFE9E1] px-2.5 py-0.5 text-xs font-medium text-[#1F2937]">
                          {member.role || 'Member'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#1F2937]">{member.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">
                        {member.status === 'invited' ? 'Invitation pending' : new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(member._id)}
                          className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {teamMembers.map((member) => (
                <div key={member._id} className="rounded-xl border border-[#E5DED6] p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2563EB] font-bold text-white">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#1F2937]">{member.name}</p>
                        <p className="text-xs text-[#6B7280]">{member.email}</p>
                        {member.status === 'invited' ? (
                          <p className="text-xs font-medium text-[#C0841A]">Invitation pending</p>
                        ) : null}
                      </div>
                    </div>
                    <span className="inline-flex items-center rounded-full border border-[#E5DED6] bg-[#EFE9E1] px-2.5 py-0.5 text-xs font-medium text-[#1F2937]">
                      {member.role || 'Member'}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-[#6B7280]">
                    <p>Phone: {member.phone || 'N/A'}</p>
                    <p>{member.status === 'invited' ? 'Invited' : `Joined: ${new Date(member.createdAt).toLocaleDateString()}`}</p>
                  </div>

                  <button
                    onClick={() => handleDelete(member._id)}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-[#1F2937]">Invite Team Member</h2>
            {teamLimitReached && (
              <div className="mb-4 rounded-lg border border-[#D7C7B3] bg-[#FFF7ED] p-3 text-sm text-[#6B7280]">
                Upgrade your plan to continue.
              </div>
            )}
            <form onSubmit={handleCreateMember} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="e.g. Rachel Adams"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Email Address</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="rachel@example.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Optional"
                />
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-[#6B7280] transition-colors hover:bg-[#EFE9E1]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={teamLimitReached}
                  className="rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
