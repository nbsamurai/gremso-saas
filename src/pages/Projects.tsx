import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Folder } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AppShell from '../components/AppShell';
import api from '../lib/api';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'Planning',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/projects', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.data.success) {
        toast.success('Project created successfully');
        setIsModalOpen(false);
        fetchProjects();
        setFormData({ name: '', clientName: '', location: '', startDate: '', endDate: '', status: 'Planning' });
      }
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  return (
    <AppShell contentClassName="p-4 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2937] sm:text-3xl">Projects</h1>
          <p className="text-sm text-[#6B7280] sm:text-base">Manage all construction and scaffolding projects</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#2563EB] px-4 py-2 text-white transition-colors hover:bg-[#1D4ED8] sm:w-auto"
        >
          <Plus className="w-5 h-5" />
          <span>New Project</span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8"><p>Loading...</p></div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {projects.map((project: any) => (
            <div
              key={project._id}
              className="cursor-pointer rounded-xl border border-[#E5DED6] bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
              onClick={() => navigate(`/projects/${project._id}`)}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div className="rounded-lg bg-[#EFE9E1] p-3">
                  <Folder className="w-6 h-6 text-[#2563EB]" />
                </div>
                <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                  project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {project.status}
                </span>
              </div>
              <h3 className="mb-1 text-lg font-semibold text-[#1F2937]">{project.name}</h3>
              <p className="mb-4 text-sm text-[#6B7280]">{project.clientName} - {project.location}</p>

              <div className="flex flex-col gap-1 border-t border-[#E5DED6] pt-4 text-sm text-[#6B7280] sm:flex-row sm:justify-between">
                <span>{new Date(project.startDate).toLocaleDateString()}</span>
                <span className="hidden sm:inline">to</span>
                <span>{new Date(project.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="col-span-full py-12 text-center text-[#6B7280]">
              No projects found. Create one to get started!
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E5DED6] p-6">
              <h2 className="text-xl font-bold text-[#1F2937]">Create New Project</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#6B7280] hover:text-[#1F2937]"
                aria-label="Close modal"
              >
                x
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="max-h-[85vh] space-y-4 overflow-y-auto p-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Project Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-[#E5DED6] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="e.g. Downtown Scaffold Tower"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Client Name</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full rounded-lg border border-[#E5DED6] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Client or Company Name"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full rounded-lg border border-[#E5DED6] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  placeholder="Site Location"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1F2937]">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-lg border border-[#E5DED6] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-[#1F2937]">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-lg border border-[#E5DED6] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1F2937]">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-[#E5DED6] bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-[#2563EB]"
                >
                  <option value="Planning">Planning</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-[#E5DED6] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-[#6B7280] hover:text-[#1F2937]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#2563EB] px-4 py-2 font-medium text-white hover:bg-[#1D4ED8]"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
