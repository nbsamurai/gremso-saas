import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  LayoutDashboard,
  FileText,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  Hammer,
  Folder,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { usePlan } from '../context/PlanContext';
import { authService } from '../services/authService';
import { hasFeatureAccess } from '../utils/planUtils';
import { isManagerRole } from '../utils/roleUtils';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { planSnapshot, clearPlan } = usePlan();

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isManager = isManagerRole(user?.role);

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const managerItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Folder, label: 'Projects', path: '/projects' },
    { icon: CalendarDays, label: 'Meetings', path: '/meetings', featureKey: 'meetings' as const },
    { icon: FileText, label: 'Documents', path: '/documents' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Users, label: 'Team', path: '/team' },
    { icon: FileText, label: 'Private Notes', path: '/notes', featureKey: 'privateNotes' as const },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const memberItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: CalendarDays, label: 'Meetings', path: '/meetings', featureKey: 'meetings' as const },
    { icon: CheckSquare, label: 'My Tasks', path: '/tasks' },
    { icon: Settings, label: 'Profile', path: '/settings' },
  ];

  const menuItems = isManager ? managerItems : memberItems;

  const handleLogout = async () => {
    await authService.logout();
    clearPlan();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-[#E5DED6] bg-[#EFE9E1] transition-transform duration-300 md:z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="border-b border-[#E5DED6] p-4">
        <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]">
            <Hammer className="h-5 w-5 text-white" />
          </div>
          <span className="font-semibold text-[#1F2937]">ZENTIVORA</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isLocked = item.featureKey ? !hasFeatureAccess(planSnapshot, item.featureKey) : false;
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`));

          if (isLocked) {
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => {
                  if (isManager) {
                    toast.error('Upgrade your plan to continue');
                    navigate('/pricing');
                    return;
                  }

                  toast.error('Your manager needs to upgrade the team plan');
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-[#9CA3AF] transition-colors hover:bg-[#F6F3EE]"
              >
                <span className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </span>
                <Lock className="h-4 w-4" />
              </button>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={`flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white text-[#2563EB] shadow-sm'
                  : 'text-[#6B7280] hover:bg-[#F6F3EE] hover:text-[#1F2937]'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {planSnapshot?.plan && (
        <div className="mx-3 mb-3 rounded-xl border border-[#D7C7B3] bg-white p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6B7280]">Current Plan</p>
          <p className="mt-2 text-base font-semibold text-[#1F2937]">{planSnapshot.plan.label}</p>
          <p className="mt-1 text-xs text-[#6B7280]">
            Team: {planSnapshot.usage.teamMembersUsed} / {planSnapshot.limits?.teamMembers ?? 'Unlimited'}
          </p>
          {isManager ? (
            <Link
              to="/pricing"
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-[#2563EB] px-3 py-2 text-sm font-medium text-white"
            >
              Upgrade Plan
            </Link>
          ) : null}
        </div>
      )}

      <div className="border-t border-[#E5DED6] p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-[#6B7280] transition-colors hover:bg-[#F6F3EE] hover:text-[#1F2937]"
        >
          <LogOut className="h-5 w-5" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
}
