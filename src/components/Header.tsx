import { useState, useEffect } from 'react';
import { Bell, Check, Menu } from 'lucide-react';
import api from '../lib/api';
import { io } from 'socket.io-client';

type HeaderProps = {
  onOpenSidebar?: () => void;
};

export default function Header({ onOpenSidebar }: HeaderProps) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();

    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
       const user = JSON.parse(userStr);
       const baseURL = api.defaults.baseURL || import.meta.env.VITE_API_URL || '';
       const socketHost = baseURL.replace('/api', '');
       const socket = io(socketHost);
       socket.emit('register', user.id);

       socket.on('new_notification', (notification) => {
           setNotifications(prev => [notification, ...prev]);
           setUnreadCount(prev => prev + 1);
       });

       return () => {
           socket.disconnect();
       };
    }
  }, []);

  const fetchNotifications = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      const res = await api.get('/notifications', config);
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n: any) => !n.read).length);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const markAllRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
      await api.patch('/notifications/read-all', {}, config);
      setNotifications(notifications.map(n => ({...n, read: true})));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const formatTime = (time: string) => {
    const d = new Date(time);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString();
  };

  return (
    <div className="sticky top-0 z-20 flex h-16 items-center overflow-visible border-b border-[#E5DED6] bg-white px-4 sm:px-6">
      <button
        type="button"
        onClick={onOpenSidebar}
        className="rounded-lg p-2 text-[#6B7280] transition-colors hover:bg-[#EFE9E1] hover:text-[#1F2937] md:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="relative ml-auto flex shrink-0 items-center justify-end overflow-visible">
        <button 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="relative p-2 rounded-full hover:bg-[#EFE9E1] transition-colors"
        >
          <Bell className="w-6 h-6 text-[#6B7280]" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          )}
        </button>

        {isDropdownOpen && (
          <div className="absolute top-full left-1/2 z-50 mt-2 w-[min(calc(100vw-2rem),24rem)] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-xl border border-[#E5DED6] bg-white shadow-xl md:left-auto md:right-0 md:w-80 md:max-w-80 md:translate-x-0">
            <div className="flex items-center justify-between gap-3 border-b border-[#E5DED6] bg-[#F6F3EE] p-4">
              <h3 className="min-w-0 font-semibold text-[#1F2937]">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="flex shrink-0 items-center text-xs text-[#2563EB] hover:underline">
                  <Check className="w-3 h-3 mr-1" /> Mark all read
                </button>
              )}
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-[#6B7280] text-sm">No new notifications</div>
              ) : (
                notifications.map(notif => (
                  <div key={notif._id} className={`p-4 border-b border-[#E5DED6] hover:bg-[#F6F3EE] transition-colors cursor-pointer ${notif.read ? 'opacity-70' : 'bg-blue-50/30'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-semibold text-sm text-[#1F2937]">{notif.title}</h4>
                    </div>
                    <p className="text-sm text-[#6B7280]">{notif.message}</p>
                    <span className="text-xs text-gray-400 mt-2 block">{formatTime(notif.createdAt)}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
