import { useState, useEffect } from 'react';
import { Mail, Phone, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';

export default function ProjectTeam({ projectId }: { projectId: string }) {
  const [team, setTeam] = useState<any[]>([]);
  const [allMembers, setAllMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [memberSearch, setMemberSearch] = useState('');

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isManager = user?.role === 'Manager' || user?.role === 'manager' || user?.role === 'Admin';

  useEffect(() => {
    fetchProjectTeam();
    if (isManager) fetchAllMembers();
  }, [projectId]);

  const fetchProjectTeam = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get(`/projects/${projectId}/team`, config);
      setTeam(res.data);
    } catch (error) {
      toast.error('Failed to load project team data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/users', config);
      setAllMembers(res.data);
    } catch (err) {
      console.error('Failed to load organization members');
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.post(`/projects/${projectId}/team`, { userIds: selectedUserIds }, config);
      setTeam(res.data.teamMembers || []);
      toast.success(selectedUserIds.length === 1 ? 'Team member added to project' : 'Team members added to project');
      setIsAddModalOpen(false);
      setSelectedUserIds([]);
      setMemberSearch('');
    } catch (err) {
      toast.error('Failed to add team member');
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.delete(`/projects/${projectId}/team/${userId}`, config);
      setTeam(res.data.teamMembers || []);
      toast.success('Team member removed');
    } catch (err) {
      toast.error('Failed to remove team member');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch(role) {
      case 'Admin': return 'bg-purple-100 text-purple-700 ring-1 ring-purple-600/20';
      case 'Manager': 
      case 'manager': return 'bg-blue-100 text-blue-700 ring-1 ring-blue-600/20';
      case 'Supervisor': return 'bg-green-100 text-green-700 ring-1 ring-green-600/20';
      default: return 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/20';
    }
  };

  const handleMemberSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  // Filter out members that are already in the project team for the dropdown
  const availableMembers = allMembers.filter(m => !team.some(t => t._id === m._id));
  const filteredMembers = availableMembers.filter((member) =>
    member.name?.toLowerCase().includes(memberSearch.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl border border-[#E5DED6] shadow-sm overflow-hidden h-full flex flex-col">
      <div className="flex flex-col gap-4 border-b border-[#E5DED6] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-[#1F2937]">Project Team</h2>
          <p className="text-[#6B7280] text-sm mt-1">People who have access to this project.</p>
        </div>
        {isManager && (
          <button 
            onClick={() => {
              setIsAddModalOpen(true);
              setMemberSearch('');
            }}
            className="flex items-center justify-center space-x-2 rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D4ED8]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {loading ? (
          <div className="text-center py-8">Loading team...</div>
        ) : team.length === 0 ? (
          <div className="text-center py-12 text-[#6B7280]">No team members assigned to this project yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member._id} className="flex items-start justify-between space-x-4 p-4 rounded-xl border border-[#E5DED6] hover:bg-[#F6F3EE] transition-colors">
                <div className="flex items-start space-x-4 min-w-0">
                  <div className="w-12 h-12 bg-[#2563EB] text-white rounded-full flex items-center justify-center text-lg font-bold shrink-0">
                    {member.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-semibold text-[#1F2937] truncate mr-2">{member.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0 ${getRoleBadgeColor(member.role)}`}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-[#6B7280] mb-1">
                      <Mail className="w-3 h-3 mr-1.5 shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center text-xs text-[#6B7280]">
                        <Phone className="w-3 h-3 mr-1.5 shrink-0" />
                        <span className="truncate">{member.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                {isManager && (
                  <button onClick={() => handleRemoveMember(member._id)} className="text-[#6B7280] hover:text-red-500 transition-colors p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="mx-4 max-h-[90vh] w-full max-w-sm overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">Add to Project</h2>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Search Team Members</label>
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search by name"
                  className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none focus:border-[#2563EB] mb-3"
                />
                <label className="block text-sm font-medium text-[#1F2937] mb-2">Select Team Members</label>
                <div className="max-h-64 overflow-y-auto border border-[#E5DED6] rounded-lg divide-y divide-[#E5DED6]">
                  {filteredMembers.map((m) => (
                    <label key={m._id} className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-[#F6F3EE]">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(m._id)}
                        onChange={() => handleMemberSelection(m._id)}
                        className="mt-1 h-4 w-4 rounded border-[#D1D5DB] text-[#2563EB] focus:ring-[#2563EB]"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1F2937] truncate">{m.name}</p>
                        <p className="text-xs text-[#6B7280] truncate">{m.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {availableMembers.length === 0 && (
                  <p className="text-xs text-amber-600 mt-2">All available members are already in the project.</p>
                )}
                {availableMembers.length > 0 && filteredMembers.length === 0 && (
                  <p className="text-xs text-[#6B7280] mt-2">No team members match that search.</p>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5DED6]">
                <button type="button" onClick={() => { setIsAddModalOpen(false); setSelectedUserIds([]); setMemberSearch(''); }} className="px-4 py-2 text-[#6B7280]">Cancel</button>
                <button type="submit" disabled={selectedUserIds.length === 0} className="px-4 py-2 bg-[#2563EB] text-white rounded-lg disabled:opacity-50">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
