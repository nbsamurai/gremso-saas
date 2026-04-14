import { useEffect, useState } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Plus,
  Users,
  Video,
  X,
} from 'lucide-react';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import toast from 'react-hot-toast';
import AppShell from '../components/AppShell';
import UpgradePrompt from '../components/UpgradePrompt';
import { usePlan } from '../context/PlanContext';
import api from '../lib/api';
import { hasFeatureAccess } from '../utils/planUtils';
import { isManagerRole } from '../utils/roleUtils';

type WorkspaceUser = {
  _id: string;
  name: string;
  email: string;
  role?: string;
};

type Meeting = {
  _id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  meetingLink: string;
  teamMembers: string[];
  createdBy: string;
  createdAt: string;
};

type MeetingFormState = {
  title: string;
  description: string;
  date: string;
  time: string;
  meetingLink: string;
  teamMembers: string[];
};

const initialFormState: MeetingFormState = {
  title: '',
  description: '',
  date: '',
  time: '',
  meetingLink: '',
  teamMembers: [],
};

const sortMeetings = (items: Meeting[]) =>
  [...items].sort((a, b) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) {
      return dateDiff;
    }

    return a.time.localeCompare(b.time);
  });

const getDateKey = (date: string) => format(parseISO(date), 'yyyy-MM-dd');

export default function Meetings() {
  const { planSnapshot } = usePlan();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [workspaceUsers, setWorkspaceUsers] = useState<WorkspaceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingMeetingId, setDeletingMeetingId] = useState<string | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState<MeetingFormState>(initialFormState);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || '';
  const isManager = isManagerRole(user?.role);
  const canUseMeetings = hasFeatureAccess(planSnapshot, 'meetings');

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  const loadMeetings = async () => {
    if (!userEmail) {
      setMeetings([]);
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(`/meetings/user/${encodeURIComponent(userEmail)}`, getAuthConfig());
      setMeetings(sortMeetings(response.data.meetings || []));
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load meetings');
    } finally {
      setLoading(false);
    }
  };

  const loadWorkspaceUsers = async () => {
    try {
      const response = await api.get('/users', getAuthConfig());
      setWorkspaceUsers(response.data || []);
    } catch (error) {
      toast.error('Failed to load team members');
    }
  };

  useEffect(() => {
    if (!canUseMeetings) {
      setLoading(false);
      return;
    }

    loadMeetings();
    loadWorkspaceUsers();
  }, [userEmail, canUseMeetings]);

  const handleToggleTeamMember = (email: string) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(email)
        ? prev.teamMembers.filter((memberEmail) => memberEmail !== email)
        : [...prev.teamMembers, email],
    }));
  };

  const handleCreateMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post(
        '/meetings/create',
        formData,
        getAuthConfig()
      );

      const createdMeeting = response.data.meeting as Meeting;
      setMeetings((prev) => sortMeetings([createdMeeting, ...prev]));
      setSelectedDateKey(getDateKey(createdMeeting.date));
      setCurrentMonth(parseISO(createdMeeting.date));
      setFormData(initialFormState);
      setIsCreateModalOpen(false);

      toast.success(response.data.message || 'Meeting created successfully');
      if (response.data.emailStatus && !response.data.emailStatus.sent) {
        toast((t) => (
          <span>
            Meeting saved. Email sending was skipped or failed.
            <button
              className="ml-3 rounded bg-[#2563EB] px-2 py-1 text-xs text-white"
              onClick={() => toast.dismiss(t.id)}
            >
              Close
            </button>
          </span>
        ));
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create meeting');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this meeting?');
    if (!confirmDelete) {
      return;
    }

    setDeletingMeetingId(id);

    try {
      const response = await api.delete(`/meetings/${id}`, getAuthConfig());
      setMeetings((prev) => prev.filter((meeting) => meeting._id !== id));
      setSelectedMeeting((prev) => (prev?._id === id ? null : prev));
      toast.success(response.data.message || 'Meeting deleted successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete meeting');
    } finally {
      setDeletingMeetingId(null);
    }
  };

  const meetingsByDate = meetings.reduce<Record<string, Meeting[]>>((groups, meeting) => {
    const dateKey = getDateKey(meeting.date);
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(meeting);
    return groups;
  }, {});

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 0 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 0 }),
  });
  const selectedDateMeetings = meetingsByDate[selectedDateKey] || [];

  if (!canUseMeetings) {
    return (
      <AppShell>
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-[#1F2937] sm:text-3xl">Meetings</h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            Schedule, share, and join team meetings without leaving the workspace.
          </p>
        </div>
        <UpgradePrompt
          message={isManager ? 'Meetings are available on Professional and Premium Plus plans.' : 'Your manager needs to upgrade the team plan to unlock meetings.'}
          showButton={isManager}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-2xl font-bold text-[#1F2937] sm:text-3xl">Meetings</h1>
          <p className="text-sm text-[#6B7280] sm:text-base">
            Schedule, share, and join team meetings without leaving the workspace.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white shadow-sm transition-colors hover:bg-[#1D4ED8] sm:w-auto"
        >
          <Plus className="h-5 w-5" />
          Create Meeting
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-[#E5DED6] bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#1F2937]">Calendar View</h2>
              <p className="text-sm text-[#6B7280]">Select a day to see scheduled meetings.</p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-full border border-[#E5DED6] bg-[#F6F3EE] p-1">
              <button
                type="button"
                onClick={() => setCurrentMonth((prev) => subMonths(prev, 1))}
                className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-white hover:text-[#1F2937]"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="min-w-[140px] text-center text-sm font-medium text-[#1F2937]">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                type="button"
                onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
                className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-white hover:text-[#1F2937]"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-[#6B7280]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const dateKey = format(day, 'yyyy-MM-dd');
              const dayMeetings = meetingsByDate[dateKey] || [];
              const isSelected = selectedDateKey === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  onClick={() => setSelectedDateKey(dateKey)}
                  className={`min-h-[88px] rounded-2xl border p-2 text-left transition-all ${
                    isSelected
                      ? 'border-[#2563EB] bg-blue-50 shadow-sm'
                      : 'border-[#E5DED6] bg-[#F9F7F3] hover:border-[#C9BEAF]'
                  } ${isSameMonth(day, currentMonth) ? 'text-[#1F2937]' : 'text-[#A8A29E]'}`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`text-sm font-semibold ${isSameDay(day, new Date()) ? 'text-[#2563EB]' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayMeetings.length > 0 && (
                      <span className="rounded-full bg-[#2563EB] px-2 py-0.5 text-[10px] font-medium text-white">
                        {dayMeetings.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    {dayMeetings.slice(0, 2).map((meeting) => (
                      <div key={meeting._id} className="truncate rounded-lg bg-white px-2 py-1 text-[11px] text-[#1F2937] shadow-sm">
                        {meeting.title}
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5DED6] bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#1F2937]">
              {selectedDateMeetings.length > 0
                ? `Meetings on ${format(parseISO(selectedDateKey), 'dd MMM yyyy')}`
                : `No meetings on ${format(parseISO(selectedDateKey), 'dd MMM yyyy')}`}
            </h2>
            <p className="text-sm text-[#6B7280]">Click any meeting for full details.</p>
          </div>

          <div className="space-y-3">
            {selectedDateMeetings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#E5DED6] bg-[#F9F7F3] p-6 text-sm text-[#6B7280]">
                No meetings scheduled for this date yet.
              </div>
            ) : (
              selectedDateMeetings.map((meeting) => (
                <button
                  key={meeting._id}
                  type="button"
                  onClick={() => setSelectedMeeting(meeting)}
                  className="w-full rounded-2xl border border-[#E5DED6] bg-[#F9F7F3] p-4 text-left transition-colors hover:border-[#2563EB] hover:bg-white"
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-[#1F2937]">{meeting.title}</h3>
                      <p className="mt-1 text-sm text-[#6B7280]">{meeting.description || 'No description provided.'}</p>
                    </div>
                    <Video className="h-5 w-5 shrink-0 text-[#2563EB]" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#6B7280]">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {meeting.time}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {meeting.teamMembers.length} invited
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-[#E5DED6] bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#1F2937]">Your Meetings</h2>
            <p className="text-sm text-[#6B7280]">Only meetings that include you are shown here.</p>
          </div>
          <span className="rounded-full bg-[#F6F3EE] px-3 py-1 text-xs font-medium text-[#6B7280]">
            {meetings.length} total
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-[#6B7280]">Loading meetings...</div>
        ) : meetings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E5DED6] bg-[#F9F7F3] p-8 text-center text-[#6B7280]">
            No meetings found yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {meetings.map((meeting) => (
              <div key={meeting._id} className="rounded-2xl border border-[#E5DED6] p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1F2937]">{meeting.title}</h3>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      {format(parseISO(meeting.date), 'dd MMM yyyy')} at {meeting.time}
                    </p>
                  </div>
                  <CalendarDays className="h-5 w-5 shrink-0 text-[#2563EB]" />
                </div>

                <p className="mb-4 text-sm text-[#6B7280]">
                  {meeting.description || 'No meeting description provided.'}
                </p>

                <div className="mb-4 flex flex-wrap gap-2">
                  {meeting.teamMembers.map((email) => (
                    <span key={email} className="rounded-full bg-[#F6F3EE] px-3 py-1 text-xs text-[#6B7280]">
                      {email}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => window.open(meeting.meetingLink, '_blank', 'noopener,noreferrer')}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Join Meeting
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMeeting(meeting)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5DED6] px-4 py-2 text-sm font-medium text-[#1F2937]"
                  >
                    View Details
                  </button>
                  {isManager && (
                    <button
                      type="button"
                      onClick={() => handleDeleteMeeting(meeting._id)}
                      disabled={deletingMeetingId === meeting._id}
                      className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
                    >
                      {deletingMeetingId === meeting._id ? 'Deleting...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937]">Create Meeting</h2>
                <p className="text-sm text-[#6B7280]">Invite your team and send the join link automatically.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F6F3EE] hover:text-[#1F2937]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Weekly site coordination"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Agenda, notes, or key discussion points"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1F2937]">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                    className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1F2937]">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData((prev) => ({ ...prev, time: e.target.value }))}
                    className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Meeting Link</label>
                <input
                  type="url"
                  required
                  value={formData.meetingLink}
                  onChange={(e) => setFormData((prev) => ({ ...prev, meetingLink: e.target.value }))}
                  className="w-full rounded-lg border border-[#E5DED6] px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="https://meet.google.com/..."
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <label className="block text-sm font-medium text-[#1F2937]">Team Members</label>
                  <span className="text-xs text-[#6B7280]">
                    Creator email is added automatically
                  </span>
                </div>
                <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-[#E5DED6] p-3">
                  {workspaceUsers.length === 0 ? (
                    <p className="text-sm text-[#6B7280]">No workspace users available.</p>
                  ) : (
                    workspaceUsers.map((member) => (
                      <label
                        key={member._id}
                        className="flex cursor-pointer items-start gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:border-[#E5DED6] hover:bg-[#F9F7F3]"
                      >
                        <input
                          type="checkbox"
                          checked={formData.teamMembers.includes(member.email)}
                          onChange={() => handleToggleTeamMember(member.email)}
                          className="mt-1 h-4 w-4 rounded border-[#D6CDC1] text-[#2563EB] focus:ring-[#2563EB]"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-[#1F2937]">{member.name}</p>
                          <p className="truncate text-sm text-[#6B7280]">{member.email}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-[#6B7280] transition-colors hover:bg-[#F6F3EE]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1D4ED8] disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Meeting'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1F2937]">{selectedMeeting.title}</h2>
                <p className="text-sm text-[#6B7280]">
                  {format(parseISO(selectedMeeting.date), 'dd MMM yyyy')} at {selectedMeeting.time}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMeeting(null)}
                className="rounded-full p-2 text-[#6B7280] transition-colors hover:bg-[#F6F3EE] hover:text-[#1F2937]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-1 text-sm font-medium text-[#1F2937]">Description</p>
                <p className="text-sm text-[#6B7280]">
                  {selectedMeeting.description || 'No description provided.'}
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-[#1F2937]">Invited Members</p>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.teamMembers.map((email) => (
                    <span key={email} className="rounded-full bg-[#F6F3EE] px-3 py-1 text-xs text-[#6B7280]">
                      {email}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-1 text-sm font-medium text-[#1F2937]">Meeting Link</p>
                <a
                  href={selectedMeeting.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="break-all text-sm text-[#2563EB] hover:underline"
                >
                  {selectedMeeting.meetingLink}
                </a>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => window.open(selectedMeeting.meetingLink, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
              >
                <ExternalLink className="h-4 w-4" />
                Join Meeting
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
