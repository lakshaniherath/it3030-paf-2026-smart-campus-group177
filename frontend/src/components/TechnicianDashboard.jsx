import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCheckCircle,
  FiClipboard,
  FiHome,
  FiLogOut,
  FiRefreshCw,
  FiTool,
} from 'react-icons/fi';
import { apiFetch, getStoredUser } from '../utils/api';
import ResourcesCatalogPage from '../features/resources/pages/ResourcesCatalogPage';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('OVERVIEW');
  const [notifications, setNotifications] = useState([]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const loadNotifications = useCallback(async () => {
    setError('');
    try {
      const response = await apiFetch('/api/notifications');
      setNotifications(Array.isArray(response.notifications) ? response.notifications : []);
    } catch (fetchError) {
      setError(fetchError.message || 'Failed to load maintenance alerts');
      setNotifications([]);
    }
  }, []);

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

    loadNotifications().finally(() => setLoading(false));
  }, [navigate, loadNotifications]);

  const maintenanceAlerts = useMemo(
    () => notifications.filter((entry) => entry.type === 'TICKET'),
    [notifications]
  );

  const assignmentLikeAlerts = useMemo(
    () => maintenanceAlerts.filter((entry) => /assign|assigned/i.test(`${entry.title} ${entry.message}`)),
    [maintenanceAlerts]
  );

  const statusLikeAlerts = useMemo(
    () => maintenanceAlerts.filter((entry) => /in_progress|resolved|closed|open/i.test(`${entry.title} ${entry.message}`)),
    [maintenanceAlerts]
  );

  const stats = useMemo(() => {
    const unread = maintenanceAlerts.filter((entry) => !entry.read).length;
    return {
      totalAlerts: maintenanceAlerts.length,
      unread,
      assignmentAlerts: assignmentLikeAlerts.length,
      statusAlerts: statusLikeAlerts.length,
    };
  }, [maintenanceAlerts, assignmentLikeAlerts, statusLikeAlerts]);

  const markAsRead = async (id) => {
    setError('');
    try {
      await apiFetch(`/api/notifications/${id}/read`, { method: 'PUT' });
      setNotifications((prev) => prev.map((entry) => (entry.id === id ? { ...entry, read: true } : entry)));
    } catch (updateError) {
      setError(updateError.message || 'Unable to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    setError('');
    try {
      await apiFetch('/api/notifications/mark-all-read', { method: 'PUT' });
      setNotifications((prev) => prev.map((entry) => ({ ...entry, read: true })));
    } catch (updateError) {
      setError(updateError.message || 'Unable to mark all alerts as read');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center text-slate-800">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-gradient-to-b from-blue-800 to-blue-600 border-r border-blue-200 px-4 py-6 hidden md:block">
          <h2 className="text-xl font-bold text-white px-2">Technician Dashboard</h2>
          <p className="text-xs text-blue-100 px-2 mt-1">Member 4 Alert Integration</p>

          <nav className="mt-8 space-y-2">
            {[
              { id: 'OVERVIEW', label: 'Overview', icon: <FiHome /> },
              { id: 'ASSIGNED_M3', label: 'Assigned Tickets (M3)', icon: <FiClipboard /> },
              { id: 'UPDATE_STATUS_M3', label: 'Update Status (M3)', icon: <FiCheckCircle /> },
              { id: 'RESOLUTION_NOTES_M3', label: 'Resolution Notes (M3)', icon: <FiClipboard /> },
              { id: 'RESOURCE_STATUS_M1', label: 'Resource Status (M1)', icon: <FiTool /> },
              { id: 'ALERTS', label: 'Maintenance Alerts', icon: <FiBell /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                  activeSection === item.id
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-semibold'
                    : 'bg-white/90 text-blue-800 border-blue-100 hover:border-blue-300'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <header className="rounded-2xl border border-blue-100 bg-white p-4 md:p-6 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Technician Dashboard</h1>
              <p className="text-slate-600 mt-1">Maintenance alerts and cross-module integration surface.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadNotifications}
                className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition flex items-center gap-2"
              >
                <FiRefreshCw />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition flex items-center gap-2"
              >
                <FiLogOut />
                Logout
              </button>
            </div>
          </header>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-rose-800 text-sm">
              {error}
            </div>
          )}

          {activeSection === 'OVERVIEW' && (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard icon={<FiBell />} label="Ticket Alerts" value={stats.totalAlerts} />
              <StatCard icon={<FiCheckCircle />} label="Unread Alerts" value={stats.unread} />
              <StatCard icon={<FiClipboard />} label="Assignment Alerts" value={stats.assignmentAlerts} />
              <StatCard icon={<FiTool />} label="Status Alerts" value={stats.statusAlerts} />
            </section>
          )}

          {activeSection === 'ASSIGNED_M3' && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Assigned Tickets List (Integration)</h2>
              <p className="text-sm text-slate-600 mb-4">
                Member 3 ticket assignment module data is reflected here through assignment-related notifications.
              </p>
              <div className="space-y-3">
                {assignmentLikeAlerts.map((entry) => (
                  <AlertItem key={entry.id} entry={entry} onMarkRead={markAsRead} />
                ))}
                {assignmentLikeAlerts.length === 0 && <p className="text-sm text-slate-600">No assignment alerts available yet.</p>}
              </div>
            </section>
          )}

          {activeSection === 'UPDATE_STATUS_M3' && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Update Ticket Status (Member 3 Integration)</h2>
              <p className="text-sm text-slate-700 leading-6">
                Ticket status update actions are implemented in Member 3 module. This dashboard integrates those actions by consuming
                status-change notifications (OPEN, IN_PROGRESS, RESOLVED, CLOSED) and surfacing them to technicians.
              </p>
            </section>
          )}

          {activeSection === 'RESOLUTION_NOTES_M3' && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">Resolution Notes (Member 3 Integration)</h2>
              <p className="text-sm text-slate-700 leading-6 mb-4">
                Resolution notes and attachments are maintained by Member 3 ticketing workflow. Related completion/update events are
                integrated through maintenance alerts below.
              </p>
              <div className="space-y-3">
                {statusLikeAlerts.map((entry) => (
                  <AlertItem key={entry.id} entry={entry} onMarkRead={markAsRead} />
                ))}
                {statusLikeAlerts.length === 0 && <p className="text-sm text-slate-600">No resolution/status alerts available yet.</p>}
              </div>
            </section>
          )}

          {activeSection === 'ALERTS' && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-semibold">Maintenance Alerts</h2>
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-1.5 rounded-lg text-sm bg-cyan-400 text-slate-950 font-semibold"
                >
                  Mark all as read
                </button>
              </div>
              <div className="space-y-3">
                {maintenanceAlerts.map((entry) => (
                  <AlertItem key={entry.id} entry={entry} onMarkRead={markAsRead} />
                ))}
                {maintenanceAlerts.length === 0 && <p className="text-sm text-slate-600">No maintenance alerts currently.</p>}
              </div>
            </section>
          )}

          {activeSection === 'RESOURCE_STATUS_M1' && (
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <ResourcesCatalogPage />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between text-slate-600">
      <span className="text-sm">{label}</span>
      <span>{icon}</span>
    </div>
    <p className="font-bold mt-2 text-3xl text-blue-900">{value}</p>
  </div>
);

const AlertItem = ({ entry, onMarkRead }) => (
  <div className="rounded-xl p-4 border border-blue-100 bg-blue-50/60">
    <div className="flex items-center justify-between gap-3">
      <p className="font-semibold">{entry.title}</p>
      {!entry.read && (
        <button
          onClick={() => onMarkRead(entry.id)}
          className="px-3 py-1 text-xs rounded-lg bg-cyan-500/20 text-cyan-200"
        >
          Mark read
        </button>
      )}
    </div>
    <p className="text-sm text-slate-700 mt-2">{entry.message}</p>
    <p className="text-xs text-slate-500 mt-2">{entry.createdAt || 'Date unavailable'}</p>
  </div>
);

export default TechnicianDashboard;
