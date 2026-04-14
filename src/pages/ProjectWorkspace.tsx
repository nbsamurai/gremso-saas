import { useState, useEffect } from 'react';
import { useParams, Link, Routes, Route, useLocation } from 'react-router-dom';
import AppShell from '../components/AppShell';
import api from '../lib/api';
import { toast } from 'react-hot-toast';

// Placeholder components for tabs
import ProjectTasks from './workspace/ProjectTasks';
import ProjectDocuments from './workspace/ProjectDocuments';
import ProjectTeam from './workspace/ProjectTeam';
import ProjectTimeline from './workspace/ProjectTimeline';

export default function ProjectWorkspace() {
  const { id } = useParams();
  const location = useLocation();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setProject(response.data.project);
      }
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { name: 'Tasks', path: `/projects/${id}/tasks`, replace: 'tasks' },
    { name: 'Documents', path: `/projects/${id}/documents`, replace: 'documents' },
    { name: 'Team', path: `/projects/${id}/team`, replace: 'team' },
    { name: 'Timeline', path: `/projects/${id}/timeline`, replace: 'timeline' },
  ];

  const currentTab = location.pathname.split('/').pop();
  const isActiveTab = (tabPath: string) => {
    return location.pathname.includes(tabPath.split('/').pop() || '');
  };

  if (loading) return <div className="flex justify-center items-center h-screen bg-[#F6F3EE]">Loading Project...</div>;
  if (!project) return <div className="flex justify-center items-center h-screen bg-[#F6F3EE]">Project Not Found</div>;

  return (
    <AppShell contentClassName="">
      <main className="flex-1 overflow-y-auto">
          {/* Project Header */}
          <div className="border-b border-[#E5DED6] bg-white px-4 py-5 sm:px-6 sm:py-6">
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#1F2937]">{project.name}</h1>
                <p className="text-sm text-[#6B7280] sm:text-base">{project.clientName} - {project.location}</p>
              </div>
              <select
                value={project.status}
                onChange={async (e) => {
                  const newStatus = e.target.value;
                  try {
                    const token = localStorage.getItem('token');
                    await api.put(`/projects/${id}`, { status: newStatus }, {
                      headers: { Authorization: `Bearer ${token}` }
                    });
                    setProject({ ...project, status: newStatus });
                    toast.success('Project status updated');
                  } catch (error) {
                    toast.error('Failed to update status');
                  }
                }}
                className={`w-full rounded-full border-none bg-no-repeat px-4 py-2 pr-8 text-sm font-medium outline-none appearance-none cursor-pointer sm:w-auto ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                  'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                }`}
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="Planning" className="bg-white text-gray-800">Planning</option>
                <option value="In Progress" className="bg-white text-gray-800">In Progress</option>
                <option value="Completed" className="bg-white text-gray-800">Completed</option>
              </select>
            </div>
            
            {/* Tabs Navigation */}
            <nav className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <div className="flex min-w-max space-x-6 sm:space-x-8">
              {tabs.map((tab) => (
                <Link
                  key={tab.name}
                  to={tab.path}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    isActiveTab(tab.path) || (currentTab === id && tab.name === 'Tasks') // Default to tasks
                      ? 'border-[#2563EB] text-[#2563EB]'
                      : 'border-transparent text-[#6B7280] hover:text-[#1F2937] hover:border-[#E5DED6]'
                  }`}
                >
                  {tab.name}
                </Link>
              ))}
              </div>
            </nav>
          </div>

          {/* Tab Content Area */}
          <div className="p-4 sm:p-6">
            <Routes>
              <Route path="/" element={<ProjectTasks projectId={id || ''} />} />
              <Route path="tasks" element={<ProjectTasks projectId={id || ''} />} />
              <Route path="documents" element={<ProjectDocuments projectId={id || ''} />} />
              <Route path="team" element={<ProjectTeam projectId={id || ''} />} />
              <Route path="timeline" element={<ProjectTimeline projectId={id || ''} />} />
            </Routes>
          </div>
        </main>
    </AppShell>
  );
}
