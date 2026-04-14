import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Notepad from '../components/Notepad';
import AppShell from '../components/AppShell';
import {
  FileText,
  CheckSquare,
  TrendingUp,
  Clock,
  Plus,
  MoreVertical,
  FolderOpen,
  Lock
} from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import UpgradePrompt from '../components/UpgradePrompt';
import { usePlan } from '../context/PlanContext';
import { formatStorage, hasFeatureAccess } from '../utils/planUtils';
import { isManagerRole, isMemberRole } from '../utils/roleUtils';

export default function Dashboard() {
  const { planSnapshot } = usePlan();
  const [stats, setStats] = useState([
    { label: 'Active Projects', value: '0', icon: FileText, trend: '' },
    { label: 'Tasks Completed', value: '0', icon: CheckSquare, trend: '' },
    { label: 'Team Members', value: '0', icon: TrendingUp, trend: '' },
    { label: 'Hours Logged', value: '0', icon: Clock, trend: '' },
  ]);

  const [recentDocuments, setRecentDocuments] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  
  const [user] = useState<any>(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [loading, setLoading] = useState(true);
  const [errorShown, setErrorShown] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };

        const dashboardRes = await api.get('/dashboard', config);
        const data = dashboardRes.data;

        setStats([
          { label: 'Active Projects', value: data.activeProjects.toString(), icon: FileText, trend: '' },
          { label: 'Tasks Completed', value: data.tasksCompleted.toString(), icon: CheckSquare, trend: '' },
          { label: 'Team Members', value: data.teamMembers.toString(), icon: TrendingUp, trend: '' },
          { label: 'Hours Logged', value: data.hoursLogged.toLocaleString(), icon: Clock, trend: '' }
        ]);

        setRecentDocuments(data.recentDocuments || []);
        
        // Active projects for the list component (limit to 5)
        // Wait, the API returns activeProjects as a number. 
        // We need the /api/dashboard to return the *list* of active projects as well, or we fetch it separately. 
        // The user spec said: "activeProjects -> count projects where status is Planning or In Progress". 
        // For the "Active Projects" list UI, we still need the list. Let's fetch /projects normally for the list.
        const projectsRes = await api.get('/projects', config);
        if (projectsRes.data && projectsRes.data.projects) {
          const activeProjList = projectsRes.data.projects.filter((p: any) => p.status !== 'Completed');
          setActiveProjects(activeProjList.slice(0, 5));
        }

        const recentActivities = (data.activities || []).map((a: any) => ({
          user: a.userId?.name || 'Unknown',
          action: a.action,
          message: a.message,
          project: a.projectId ? a.projectId.name : null,
          time: new Date(a.createdAt).toLocaleString(undefined, {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
          })
        }));
        setActivities(recentActivities);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (!errorShown) {
          toast.error('Failed to load dashboard data');
          setErrorShown(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Task Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskPriority, setTaskPriority] = useState('Medium');
  const [taskAssignedTo, setTaskAssignedTo] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const hasPrivateNotes = hasFeatureAccess(planSnapshot, 'privateNotes');
  const hasAdvancedFeatures = hasFeatureAccess(planSnapshot, 'advanced');
  const isManager = isManagerRole(user?.role);

  // Document Modal State
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docStatus, setDocStatus] = useState('Draft');
  const [docFile, setDocFile] = useState<File | null>(null);

  // Fetch team members when task modal opens to populate assignment dropdown
  useEffect(() => {
    if (isTaskModalOpen && teamMembers.length === 0) {
      const fetchMembers = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
          const res = await api.get('/users', config);
          setTeamMembers(res.data);
          if (res.data.length > 0) setTaskAssignedTo(res.data[0]._id);
        } catch (err) {
          console.error(err);
        }
      };
      fetchMembers();
    }
  }, [isTaskModalOpen, teamMembers.length]);

  useEffect(() => {
    if (isTaskModalOpen && projects.length === 0) {
      const fetchProjects = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
          const res = await api.get('/projects', config);
          setProjects(res.data.projects || []);
          if (res.data.projects?.length > 0) setTaskProjectId(res.data.projects[0]._id);
        } catch (err) {
          console.error(err);
        }
      };
      fetchProjects();
    }
  }, [isTaskModalOpen, projects.length]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await api.post('/tasks', {
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        projectId: taskProjectId,
        assignedTo: taskAssignedTo,
        dueDate: taskDueDate
      }, config);
      toast.success('Task created successfully');
      setIsTaskModalOpen(false);
      setTaskTitle('');
      setTaskDescription('');
      setTaskProjectId('');
      
      // Fast refresh projects
      if (!isMemberRole(user?.role)) {
        const projectsRes = await api.get('/projects', config);
        const activeProjList = projectsRes.data.projects.filter((p: any) => p.status !== 'Completed');
        setActiveProjects(activeProjList.slice(0, 5));
      }

      const dashboardRes = await api.get('/dashboard', config);
      const data = dashboardRes.data;
      setStats([
        { label: 'Active Projects', value: data.activeProjects.toString(), icon: FileText, trend: '' },
        { label: 'Tasks Completed', value: data.tasksCompleted.toString(), icon: CheckSquare, trend: '' },
        { label: 'Team Members', value: data.teamMembers.toString(), icon: TrendingUp, trend: '' },
        { label: 'Hours Logged', value: data.hoursLogged.toLocaleString(), icon: Clock, trend: '' }
      ]);
      setActivities((data.activities || []).map((a: any) => ({
        user: a.userId?.name || 'Unknown',
        action: a.action,
        message: a.message,
        project: a.projectId ? a.projectId.name : null,
        time: new Date(a.createdAt).toLocaleString(undefined, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        })
      })));
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create task');
    }
  };


  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFile) {
      toast.error('Please select a file');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', docTitle);
      formData.append('status', docStatus);
      formData.append('file', docFile);

      const config = { 
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        } 
      };
      await api.post('/documents', formData, config);
      toast.success('Document uploaded successfully');
      setIsDocModalOpen(false);
      setDocTitle('');
      setDocFile(null);
      setDocStatus('Draft');

      // Fast refresh
      const dashboardRes = await api.get('/dashboard', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      setRecentDocuments(dashboardRes.data.recentDocuments || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload document');
    }
  };

  return (
    <AppShell>
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500 font-medium">
            Loading dashboard...
          </div>
        ) : (
          <div className="flex flex-col space-y-6 sm:space-y-8">
            {/* Welcome Section */}
            <div>
              <h1 className="mb-2 text-2xl font-bold text-[#1F2937] sm:text-3xl">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'}
              </h1>
              <p className="text-sm text-[#6B7280] sm:text-base">
                Here's what's happening with your projects today.
              </p>
            </div>

            {planSnapshot?.plan && (
              <div className="rounded-2xl border border-[#E5DED6] bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#2563EB]">Active Plan</p>
                    <h2 className="mt-2 text-2xl font-bold text-[#1F2937]">{planSnapshot.plan.label}</h2>
                    <p className="mt-2 text-sm text-[#6B7280]">
                      Team usage: {planSnapshot.usage.teamMembersUsed} / {planSnapshot.limits?.teamMembers ?? 'Unlimited'} members
                    </p>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Storage usage: {formatStorage(planSnapshot.usage.storageUsedBytes)} / {formatStorage(planSnapshot.limits?.storageBytes ?? null)}
                    </p>
                  </div>

                  {isManager ? (
                    <Link
                      to="/pricing"
                      className="inline-flex items-center justify-center rounded-lg border border-[#D7C7B3] bg-[#FFF7ED] px-4 py-2 text-sm font-medium text-[#1F2937]"
                    >
                      Upgrade Plan
                    </Link>
                  ) : null}
                </div>

                {!hasAdvancedFeatures && isManager && (
                  <div className="mt-5 grid gap-3 md:grid-cols-2">
                    <div className="rounded-xl border border-dashed border-[#E5DED6] bg-[#F9F7F3] p-4">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-[#C0841A]" />
                        <div>
                          <p className="font-medium text-[#1F2937]">Meetings are locked</p>
                          <p className="text-sm text-[#6B7280]">Upgrade to Professional or Premium Plus to schedule meetings.</p>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl border border-dashed border-[#E5DED6] bg-[#F9F7F3] p-4">
                      <div className="flex items-center gap-3">
                        <Lock className="h-5 w-5 text-[#C0841A]" />
                        <div>
                          <p className="font-medium text-[#1F2937]">Private notes are locked</p>
                          <p className="text-sm text-[#6B7280]">Upgrade to keep personal notes inside the workspace.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
            {stats.map((stat: any, index: number) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-[#E5DED6] bg-white p-4 shadow-sm sm:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-[#EFE9E1] rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#1F2937]" />
                    </div>
                    <span className="text-sm font-medium text-green-600">
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-[#1F2937] mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#6B7280]">{stat.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-[#E5DED6] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <Link to="/documents" className="hover:opacity-70 transition-opacity">
                  <h2 className="cursor-pointer text-base font-semibold text-[#1F2937] sm:text-lg">
                    Recent Documents
                  </h2>
                </Link>
                <button
                  onClick={() => setIsDocModalOpen(true)} 
                  className="p-2 hover:bg-[#EFE9E1] rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 text-[#6B7280]" />
                </button>
              </div>
              <div className="space-y-4">
                {recentDocuments.length === 0 ? (
                  <p className="text-sm text-[#6B7280]">No documents found.</p>
                ) : (
                  recentDocuments.map((doc: any, index: number) => (
                    <div
                      key={index}
                      className="flex cursor-pointer flex-col gap-3 rounded-lg p-3 transition-colors hover:bg-[#EFE9E1] sm:flex-row sm:items-start sm:justify-between"
                      onClick={() => window.open(`${api.defaults.baseURL?.replace('/api', '')}${doc.fileUrl}`, '_blank')}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-[#EFE9E1] rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="w-5 h-5 text-[#6B7280]" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#1F2937] text-sm">
                            {doc.title}
                          </p>
                          <p className="text-xs text-[#6B7280]">{new Date(doc.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span
                        className={`w-fit text-xs px-2 py-1 rounded-full ${
                          doc.status === 'Published'
                            ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20'
                            : 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[#E5DED6] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
                <Link to="/projects" className="hover:opacity-70 transition-opacity">
                  <h2 className="cursor-pointer text-base font-semibold text-[#1F2937] sm:text-lg">
                    Active Projects
                  </h2>
                </Link>
                <Link 
                  to="/projects"
                  className="p-2 hover:bg-[#EFE9E1] rounded-lg transition-colors"
                >
                  <FolderOpen className="w-5 h-5 text-[#6B7280]" />
                </Link>
              </div>
              <div className="space-y-3">
                {activeProjects.length === 0 ? (
                  <p className="text-sm text-[#6B7280]">No active projects found.</p>
                ) : (
                  activeProjects.map((project: any, index: number) => (
                    <div
                      key={index}
                      className="flex cursor-pointer flex-col gap-3 rounded-lg p-3 transition-colors hover:bg-[#EFE9E1] sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <FolderOpen className="w-4 h-4 text-[#2563EB]" />
                        <span className="text-sm text-[#1F2937]">{project.name}</span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          project.status === 'Planning'
                            ? 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/20'
                            : 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20'
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
            </div>

            {/* Bottom Row: Activity and Notepad */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="flex h-[400px] flex-col rounded-xl border border-[#E5DED6] bg-white p-4 shadow-sm sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-[#1F2937] sm:text-lg">
                Recent Team Activity
              </h2>
              <button className="p-2 hover:bg-[#EFE9E1] rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-[#6B7280]" />
              </button>
            </div>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
              {activities.length === 0 ? (
                <p className="text-sm text-[#6B7280]">No recent activity.</p>
              ) : (
                activities.map((activity: any, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 hover:bg-[#EFE9E1] rounded-lg transition-colors">
                    <div className="w-10 h-10 bg-[#white] rounded-full flex items-center justify-center flex-shrink-0 border border-[#E5DED6]">
                      <span className="text-[#2563EB] font-bold text-sm">
                        {activity.user && typeof activity.user === 'string' ? activity.user.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1F2937]">
                        <span className="font-semibold">{activity.user}</span> {activity.message.replace(` – by ${activity.user.split(' ')[0]}`, '')}
                        {activity.project && <span className="text-[#2563EB]"> ({activity.project})</span>}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))
              )}
              </div>
            </div>
            
            {/* Notepad Widget */}
            <div className="h-[400px]">
              {!isMemberRole(user?.role) && hasPrivateNotes ? (
                <Notepad />
              ) : !isMemberRole(user?.role) ? (
                <UpgradePrompt
                  compact
                  title="Private notes are not available on your plan"
                  message="Upgrade to Professional or Premium Plus to unlock private note-taking."
                />
              ) : null}
            </div>
          </div>
        </div>
        )}
      </div>

      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">Create New Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Task Title</label>
                <input type="text" required value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Description</label>
                <textarea value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Project</label>
                  <select value={taskProjectId} onChange={(e) => setTaskProjectId(e.target.value)} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none" required>
                    <option value="" disabled>Select Project</option>
                    {projects.map((project: any) => (
                      <option key={project._id} value={project._id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Priority</label>
                  <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Assign To</label>
                  <select value={taskAssignedTo} onChange={(e) => setTaskAssignedTo(e.target.value)} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none" required>
                    {teamMembers.map((m: any) => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Due Date</label>
                <input type="date" required value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-4 py-2 text-[#6B7280] hover:bg-[#EFE9E1] rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] rounded-lg">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">Upload Document</h2>
            <form onSubmit={handleUploadDocument} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Document Title</label>
                <input type="text" required value={docTitle} onChange={(e) => setDocTitle(e.target.value)} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Upload File</label>
                <input type="file" required onChange={(e) => setDocFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Status</label>
                <select value={docStatus} onChange={(e) => setDocStatus(e.target.value)} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none">
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsDocModalOpen(false)} className="px-4 py-2 text-[#6B7280] hover:bg-[#EFE9E1] rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2563EB] text-white hover:bg-[#1D4ED8] rounded-lg">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
