import React, { useState, useEffect } from 'react';
import { Plus, Calendar, AlignLeft } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import api from '../../lib/api';

const COLUMNS = [
  { id: 'To Do', title: 'To Do' },
  { id: 'In Progress', title: 'In Progress' },
  { id: 'In Review', title: 'In Review' },
  { id: 'Completed', title: 'Completed' },
];

function SortableTaskItem({ task, onClick }: { task: any, onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'High': return 'bg-red-100 text-red-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-green-100 text-green-700';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={`bg-white p-4 rounded-xl shadow-sm border border-[#E5DED6] mb-3 cursor-grab hover:shadow-md transition-shadow ${isDragging ? 'ring-2 ring-[#2563EB] z-50' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${getPriorityColor(task.priority)}`}>
          {task.priority || 'Medium'}
        </span>
        <div className="flex -space-x-1">
          {task.assignedTo && (
            <div className="w-6 h-6 rounded-full bg-[#EFE9E1] text-[#2563EB] flex items-center justify-center text-xs font-bold border border-white" title={task.assignedTo.name}>
              {task.assignedTo.name?.charAt(0)}
            </div>
          )}
        </div>
      </div>
      <h3 className="text-sm font-semibold text-[#1F2937] leading-tight mb-2 line-clamp-2">{task.title}</h3>
      {task.description && (
        <div className="flex items-center text-xs text-[#6B7280] mb-3">
          <AlignLeft className="w-3 h-3 mr-1" />
          <span className="truncate">{task.description}</span>
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-[#6B7280] pt-3 border-t border-[#E5DED6]">
        <div className="flex items-center">
          <Calendar className="w-3 h-3 mr-1" />
          {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
}

export default function ProjectTasks({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  // Drag state
  const [activeTask, setActiveTask] = useState<any | null>(null);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', priority: 'Medium', assignedTo: '', dueDate: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '', description: '', priority: 'Medium', assignedTo: '', dueDate: '', status: 'To Do'
  });

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isManager = user?.role !== 'member' && user?.role !== 'Worker';

  useEffect(() => {
    fetchTasks();
    if (isManager) fetchTeamMembers();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get(`/tasks/project/${projectId}`, config);
      setTasks(res.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await api.get('/users', config);
      setTeamMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t._id === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeTask = tasks.find(t => t._id === activeId);
    if (!activeTask) return;

    let targetStatus = activeTask.status;

    // Check if dropping on a column
    if (COLUMNS.find(c => c.id === overId)) {
      targetStatus = overId as string;
    } else {
      // Over another task
      const overTask = tasks.find(t => t._id === overId);
      if (overTask) targetStatus = overTask.status;
    }

    if (activeTask.status !== targetStatus) {
      // Optimistic update
      setTasks(tasks.map(t => t._id === activeId ? { ...t, status: targetStatus } : t));

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await api.patch(`/tasks/update-status/${activeId}`, { status: targetStatus }, config);
        // Maybe fetch again or rely on optimistic
      } catch (err) {
        toast.error('Failed to update task status');
        fetchTasks(); // Revert on failure
      }
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await api.post('/tasks', { ...formData, projectId, status: 'To Do' }, config);
      toast.success('Task created');
      setIsCreateModalOpen(false);
      setFormData({ title: '', description: '', priority: 'Medium', assignedTo: '', dueDate: '' });
      fetchTasks();
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-[#1F2937]">Task Board</h2>
        {isManager && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-[#2563EB] px-3 py-2 text-sm text-white transition-colors hover:bg-[#1D4ED8] sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading tasks...</div>
      ) : (
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 overflow-x-auto pb-4 h-full">
            {COLUMNS.map(col => {
              // Map old statuses to new statuses for backward compatibility if any
              const getColTasks = () => {
                return tasks.filter(t => {
                  let s = t.status;
                  if (s === 'pending') s = 'To Do';
                  if (s === 'in-progress') s = 'In Progress';
                  if (s === 'completed') s = 'Completed';
                  return s === col.id;
                });
              };
              const colTasks = getColTasks();
              
              return (
                <div key={col.id} className="min-w-[300px] w-[300px] bg-[#EFE9E1] rounded-xl p-4 flex flex-col max-h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-[#1F2937]">{col.title}</h3>
                    <span className="bg-[#E5DED6] text-[#6B7280] text-xs font-medium px-2 py-0.5 rounded-full">
                      {colTasks.length}
                    </span>
                  </div>

                  <SortableContext items={colTasks.map(t => t._id)}>
                    <div className="flex-1 overflow-y-auto" id={col.id}>
                       <div style={{ minHeight: '100px' }} data-dnd-droppable-id={col.id}>
                         {colTasks.map(task => (
                           <SortableTaskItem key={task._id} task={task} onClick={() => {
                             setSelectedTask(task);
                             setEditFormData({
                               title: task.title || '',
                               description: task.description || '',
                               priority: task.priority || 'Medium',
                               assignedTo: task.assignedTo?._id || '',
                               dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                               status: task.status || 'To Do'
                             });
                             setIsEditModalOpen(true);
                           }} />
                         ))}
                       </div>
                    </div>
                  </SortableContext>
                </div>
              )
            })}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="bg-white p-4 rounded-xl shadow-xl border-2 border-[#2563EB] rotate-3 cursor-grabbing opacity-90 w-[280px]">
                <h3 className="text-sm font-semibold text-[#1F2937] mb-2">{activeTask.title}</h3>
                <div className="flex justify-between text-xs text-[#6B7280]">
                  <span>{activeTask.priority} Priority</span>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">Create Task</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Assign To</label>
                  <select required value={formData.assignedTo} onChange={e => setFormData({...formData, assignedTo: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none">
                    <option value="" disabled>Select Member</option>
                    {teamMembers.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Due Date</label>
                  <input required type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Priority</label>
                <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5DED6]">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-[#6B7280]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2563EB] text-white rounded-lg">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#1F2937] mb-4">Edit Task</h2>
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await api.patch(`/tasks/${selectedTask._id}`, editFormData, config);
                toast.success('Task updated');
                setIsEditModalOpen(false);
                setSelectedTask(null);
                fetchTasks();
              } catch (err) {
                toast.error('Failed to update task');
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Title</label>
                <input required type="text" value={editFormData.title} onChange={e => setEditFormData({...editFormData, title: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#1F2937] mb-1">Description</label>
                <textarea value={editFormData.description} onChange={e => setEditFormData({...editFormData, description: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none" rows={3}></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Assign To</label>
                  <select required value={editFormData.assignedTo} onChange={e => setEditFormData({...editFormData, assignedTo: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none">
                    <option value="" disabled>Select Member</option>
                    {teamMembers.map(m => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Due Date</label>
                  <input required type="date" value={editFormData.dueDate} onChange={e => setEditFormData({...editFormData, dueDate: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Status</label>
                  <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none">
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1F2937] mb-1">Priority</label>
                  <select value={editFormData.priority} onChange={e => setEditFormData({...editFormData, priority: e.target.value})} className="w-full px-4 py-2 border border-[#E5DED6] rounded-lg outline-none">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E5DED6]">
                <button type="button" onClick={() => { setIsEditModalOpen(false); setSelectedTask(null); }} className="px-4 py-2 text-[#6B7280]">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#2563EB] text-white rounded-lg">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
