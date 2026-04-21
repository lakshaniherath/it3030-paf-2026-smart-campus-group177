import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCalendar, FiClock, FiLogOut, FiRefreshCw, FiUser } from 'react-icons/fi';
import { apiFetch, getStoredUser } from '../utils/api';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser?.email) {
      navigate('/login');
      return;
    }
    setUser(storedUser);
    setLoading(false);
  }, [navigate]);

  const loadNotifications = useCallback(async () => {
    setError('');
    try {
      const response = await apiFetch('/api/notifications');
      setNotifications(Array.isArray(response.notifications) ? response.notifications : []);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load notifications');
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      loadNotifications();
    }
  }, [loading, user, loadNotifications]);

  const markAsRead = async (id) => {
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications((prev) => prev.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)));
    } catch (updateError) {
      setError(updateError.message || 'Unable to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiFetch('/api/notifications/mark-all-read', { method: 'PUT' });
      setNotifications((prev) => prev.map((entry) => ({ ...entry, read: true })));
    } catch (updateError) {
      setError(updateError.message || 'Unable to mark all notifications as read');
    }
  };

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'ALL') {
      return notifications;
    }
    return notifications.filter((entry) => entry.type === activeFilter);
  }, [notifications, activeFilter]);

  const stats = useMemo(() => {
    const unread = notifications.filter((entry) => !entry.read).length;
    const bookings = notifications.filter((entry) => entry.type === 'BOOKING').length;
    const tickets = notifications.filter((entry) => entry.type === 'TICKET').length;
    return { unread, bookings, tickets };
  }, [notifications]);

  if (loading) {
    return <div className="min-h-screen bg-[#07111f] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-6 md:p-10">
      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-300">User Dashboard</h1>
          <p className="text-slate-400 mt-2">Track your booking and maintenance updates from one place.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadNotifications}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-2"
          >
            <FiRefreshCw />
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-2"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="mb-6 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-rose-200 text-sm">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <SummaryCard icon={<FiBell />} label="Unread" value={stats.unread} />
        <SummaryCard icon={<FiCalendar />} label="Booking Alerts" value={stats.bookings} />
        <SummaryCard icon={<FiClock />} label="Ticket Alerts" value={stats.tickets} />
        <SummaryCard icon={<FiUser />} label="Role" value={user?.role || 'USER'} compact />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-semibold">My Notifications</h2>
            <button
              onClick={markAllAsRead}
              className="px-3 py-1.5 rounded-lg text-sm bg-cyan-400 text-slate-950 font-semibold"
            >
              Mark all as read
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {['ALL', 'BOOKING', 'TICKET', 'COMMENT', 'SYSTEM'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-full text-xs border ${
                  activeFilter === filter
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                    : 'bg-white/5 text-slate-300 border-white/15'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredNotifications.map((entry) => (
              <div key={entry.id} className="rounded-xl p-4 border border-white/10 bg-slate-900/70">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold">{entry.title}</p>
                    <p className="text-xs text-slate-400 mt-1">Type: {entry.type || 'SYSTEM'}</p>
                  </div>
                  {!entry.read && (
                    <button
                      onClick={() => markAsRead(entry.id)}
                      className="px-3 py-1 text-xs rounded-lg bg-cyan-500/20 text-cyan-200"
                    >
                      Mark read
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-300 mt-2">{entry.message}</p>
                <p className="text-xs text-slate-500 mt-2">{entry.createdAt || 'Date unavailable'}</p>
              </div>
            ))}
            {filteredNotifications.length === 0 && (
              <p className="text-sm text-slate-400">No notifications found for this filter.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
          <div className="space-y-3 text-sm">
            <IntegrationItem
              title="Module B: Bookings"
              description="Booking approval and rejection updates appear here as BOOKING notifications."
            />
            <IntegrationItem
              title="Module C: Incidents"
              description="Technician status updates appear here as TICKET notifications."
            />
            <IntegrationItem
              title="Module D: Notifications"
              description="This dashboard and the floating notification panel share the same backend API."
            />
            <IntegrationItem
              title="Module E: Security"
              description="Role and access control are enforced through protected routes and backend auth."
            />
          </div>

          <div className="mt-6 rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <p className="text-xs text-slate-400">Logged in as</p>
            <p className="font-semibold mt-1">{user?.name || 'User'}</p>
            <p className="text-sm text-slate-300">{user?.email || 'Email unavailable'}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ icon, label, value, compact = false }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center justify-between text-slate-300">
      <span className="text-sm">{label}</span>
      <span>{icon}</span>
    </div>
    <p className={`font-bold mt-2 ${compact ? 'text-lg' : 'text-3xl'}`}>{value}</p>
  </div>
);

const IntegrationItem = ({ title, description }) => (
  <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
    <p className="font-semibold">{title}</p>
    <p className="text-slate-400 mt-1">{description}</p>
  </div>
);

export default UserDashboard;