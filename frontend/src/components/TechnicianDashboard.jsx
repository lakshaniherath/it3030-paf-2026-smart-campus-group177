import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCheckCircle, FiClock, FiLogOut, FiRefreshCw, FiTool } from 'react-icons/fi';
import { apiFetch, getStoredUser } from '../utils/api';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [ticketForm, setTicketForm] = useState({
    userEmail: '',
    ticketId: '',
    status: 'IN_PROGRESS',
    note: '',
  });

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

    if (storedUser.role !== 'TECHNICIAN') {
      navigate('/dashboard');
      return;
    }

    setUser(storedUser);
    setLoading(false);
  }, [navigate]);

  const loadTechnicianData = useCallback(async () => {
    setError('');
    try {
      const [usersResponse, notificationsResponse] = await Promise.all([
        apiFetch('/api/admin/users'),
        apiFetch('/api/notifications'),
      ]);

      setUsers(Array.isArray(usersResponse.users) ? usersResponse.users : []);
      setNotifications(Array.isArray(notificationsResponse.notifications) ? notificationsResponse.notifications : []);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load technician data');
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      loadTechnicianData();
    }
  }, [loading, user, loadTechnicianData]);

  const handleTicketUpdateSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!ticketForm.userEmail || !ticketForm.ticketId || !ticketForm.note) {
      setError('User email, ticket id and update note are required.');
      return;
    }

    try {
      await apiFetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: ticketForm.userEmail,
          type: 'TICKET',
          title: `Ticket ${ticketForm.status}`,
          message: ticketForm.note,
          relatedId: ticketForm.ticketId,
        }),
      });

      setTicketForm({ userEmail: '', ticketId: '', status: 'IN_PROGRESS', note: '' });
      await loadTechnicianData();
    } catch (submitError) {
      setError(submitError.message || 'Unable to send ticket update');
    }
  };

  const ticketNotifications = useMemo(
    () => notifications.filter((entry) => entry.type === 'TICKET'),
    [notifications]
  );

  const unreadCount = useMemo(
    () => notifications.filter((entry) => !entry.read).length,
    [notifications]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111f] text-white p-6 md:p-10">
      <header className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-300">Technician Dashboard</h1>
          <p className="text-slate-400 mt-2">Update maintenance progress and notify affected users.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadTechnicianData}
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

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FiTool />} label="Known Campus Users" value={users.length} />
        <StatCard icon={<FiClock />} label="Unread Notifications" value={unreadCount} />
        <StatCard icon={<FiBell />} label="Ticket Alerts" value={ticketNotifications.length} />
        <StatCard icon={<FiCheckCircle />} label="Technician Role" value={user?.role || 'TECHNICIAN'} compact />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Ticket Notifications</h2>
          <p className="text-sm text-slate-400 mb-4">Notifications from the ticketing flow (Module C and Module D integration).</p>
          <div className="space-y-3">
            {ticketNotifications.slice(0, 8).map((entry) => (
              <div key={entry.id} className="rounded-xl p-4 border border-white/10 bg-slate-900/70">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold">{entry.title}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${entry.read ? 'bg-slate-500/20 text-slate-300' : 'bg-cyan-500/20 text-cyan-200'}`}>
                    {entry.read ? 'Read' : 'Unread'}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-2">{entry.message}</p>
                <p className="text-xs text-slate-500 mt-2">Ticket: {entry.relatedId || 'N/A'} | {entry.createdAt || 'Date unavailable'}</p>
              </div>
            ))}
            {ticketNotifications.length === 0 && (
              <p className="text-sm text-slate-400">No ticket notifications available yet.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold mb-4">Send Ticket Update</h2>
          <p className="text-sm text-slate-400 mb-4">Creates a TICKET notification for the selected user.</p>

          <form className="space-y-3" onSubmit={handleTicketUpdateSubmit}>
            <input
              type="email"
              placeholder="Affected user email"
              value={ticketForm.userEmail}
              onChange={(event) => setTicketForm((prev) => ({ ...prev, userEmail: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
            />

            <input
              type="text"
              placeholder="Ticket ID"
              value={ticketForm.ticketId}
              onChange={(event) => setTicketForm((prev) => ({ ...prev, ticketId: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
            />

            <select
              value={ticketForm.status}
              onChange={(event) => setTicketForm((prev) => ({ ...prev, status: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
            </select>

            <textarea
              rows={4}
              placeholder="Resolution note or progress update"
              value={ticketForm.note}
              onChange={(event) => setTicketForm((prev) => ({ ...prev, note: event.target.value }))}
              className="w-full rounded-xl border border-white/15 bg-slate-900 px-3 py-2 text-sm"
            />

            <button type="submit" className="w-full rounded-xl bg-cyan-400 text-slate-950 px-4 py-2 font-semibold">
              Send Update
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, compact = false }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
    <div className="flex items-center justify-between text-slate-300">
      <span className="text-sm">{label}</span>
      <span>{icon}</span>
    </div>
    <p className={`font-bold mt-2 ${compact ? 'text-lg' : 'text-3xl'}`}>{value}</p>
  </div>
);

export default TechnicianDashboard;