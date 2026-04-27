import React, { useState, useEffect, useRef } from 'react';
import { FaBell } from 'react-icons/fa';
import { getUserRequests, getMechanicRequests } from '../services/api';

const NotificationBell = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = user.role === 'mechanic' ? await getMechanicRequests() : await getUserRequests();
        
        // Treat updated requests as "notifications" by sorting updatedAt
        const sorted = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
        setNotifications(sorted);

        const lastViewed = localStorage.getItem('lastNotificationView');
        if (!lastViewed) {
          setHasUnread(sorted.length > 0);
        } else {
          const hasNew = sorted.some(r => new Date(r.updatedAt) > new Date(lastViewed));
          setHasUnread(hasNew);
        }
      } catch (err) {
        console.error("Failed to fetch notifications fallback", err);
      }
    };

    if (user && user.role !== 'admin') {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // background poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // User opens it, count them as "Read" 
      localStorage.setItem('lastNotificationView', new Date().toISOString());
      setHasUnread(false);
    }
  };

  if (!user || user.role === 'admin') return null; // Admins handle things manually

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="relative p-2.5 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800 mt-1">
        <FaBell className="text-[17px]" />
        {hasUnread && (
          <span className="absolute top-2 right-2.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-red shadow-[0_0_8px_rgba(234,0,41,0.8)]"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] z-50 overflow-hidden animate-fade-in">
          <div className="p-4 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
            <h3 className="text-white font-bold text-sm uppercase tracking-wider">Alerts & Updates</h3>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-sm">No recent activity. Check back later!</div>
            ) : (
              notifications.map((n, i) => (
                <div key={i} className="p-4 border-b border-zinc-800/30 hover:bg-zinc-800/50 transition-colors">
                   <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">{new Date(n.updatedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                   {user.role === 'user' ? (
                       <p className="text-sm text-zinc-300">
                         <strong>{n.mechanic?.name || 'Your Mechanic'}</strong> {
                           n.status === 'Accepted' ? <span className="text-emerald-400">accepted your booking!</span> : 
                           n.status === 'Completed' ? <span className="text-blue-400">marked your service as Complete.</span> : 
                           n.status === 'Rejected' ? <span className="text-red-400">declined your request.</span> :
                           `updated your request to ${n.status}.`
                         }
                       </p>
                   ) : (
                       <p className="text-sm text-zinc-300">
                         {n.status === 'Pending' ? (
                            <span><strong>{n.user?.name || 'A customer'}</strong> sent a new {n.isEmergency ? <span className="text-red-500 font-bold">🚨 SOS</span> : 'Booking'} request!</span>
                         ) : (
                            <span>You updated a job from <strong>{n.user?.name || 'a customer'}</strong> to <span className="text-brand-red">{n.status}</span>.</span>
                         )}
                       </p>
                   )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
