import { useState, useEffect } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { Calendar as CalendarIcon, Flag } from 'lucide-react';

export default function ProjectTimeline({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [projectId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [projRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`, config),
        api.get(`/tasks?projectId=${projectId}`, config)
      ]);
      setProject(projRes.data.project);
      
      // Sort tasks by due date
      const sortedTasks = tasksRes.data.sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      setTasks(sortedTasks);
      
    } catch (err) {
      toast.error('Failed to load timeline data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading timeline...</div>;
  if (!project) return <div className="p-8 text-center text-red-500">Timeline unavailable.</div>;

  return (
    <div className="bg-white rounded-xl border border-[#E5DED6] shadow-sm overflow-hidden h-full">
      <div className="p-6 border-b border-[#E5DED6]">
        <h2 className="text-xl font-bold text-[#1F2937]">Project Timeline</h2>
        <p className="text-[#6B7280] text-sm mt-1">Project duration and task deadlines</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <div className="relative ml-3 space-y-8 border-l-2 border-[#2563EB] py-4 sm:ml-4">
          
          {/* Project Start */}
          <div className="relative">
            <div className="absolute -left-[19px] mt-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-[#2563EB] sm:-left-[25px] sm:h-12 sm:w-12">
               <Flag className="w-5 h-5 text-white" />
            </div>
            <div className="ml-7 rounded-xl border border-[#E5DED6] bg-[#EFE9E1] p-4 sm:ml-10">
              <h3 className="font-bold text-[#1F2937]">Project Start Phase</h3>
              <p className="text-sm text-[#6B7280] mt-1">{project.name}</p>
              <div className="flex items-center mt-3 text-xs font-semibold text-[#2563EB]">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {new Date(project.startDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Task Deadlines */}
          {tasks.map((task) => (
            <div key={task._id} className="relative">
               <div className={`absolute -left-[10px] mt-1 h-5 w-5 rounded-full border-4 border-white sm:-left-[13px] sm:h-6 sm:w-6 ${
                 task.status === 'Completed' ? 'bg-green-500' : 'bg-[#E5DED6]'
               }`} />
               <div className="ml-6 rounded-xl border border-[#E5DED6] bg-white p-4 transition-shadow hover:shadow-md sm:ml-8">
                 <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                   <div>
                     <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mb-2 inline-block ${
                       task.priority === 'High' ? 'bg-red-100 text-red-700' : task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                     }`}>
                       {task.priority || 'Medium'} Task
                     </span>
                     <h3 className={`text-sm font-semibold mt-1 ${task.status === 'Completed' ? 'line-through text-[#6B7280]' : 'text-[#1F2937]'}`}>
                       {task.title}
                     </h3>
                   </div>
                   <div className="text-right">
                     <span className="text-xs font-medium text-[#6B7280]">Due Date</span>
                     <div className="flex items-center text-xs font-semibold text-[#1F2937] mt-1">
                       <CalendarIcon className="w-3 h-3 mr-1" />
                       {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          ))}

          {/* Project End */}
          <div className="relative">
            <div className="absolute -left-[19px] mt-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-white bg-[#2563EB] sm:-left-[25px] sm:h-12 sm:w-12">
               <Flag className="w-5 h-5 text-white" />
            </div>
            <div className="ml-7 rounded-xl border border-[#E5DED6] bg-[#EFE9E1] p-4 sm:ml-10">
              <h3 className="font-bold text-[#1F2937]">Target Delivery / End Date</h3>
              <p className="text-sm text-[#6B7280] mt-1">{project.name} Completion</p>
              <div className="flex items-center mt-3 text-xs font-semibold text-[#2563EB]">
                <CalendarIcon className="w-4 h-4 mr-1" />
                {new Date(project.endDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
