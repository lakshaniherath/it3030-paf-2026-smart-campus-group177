import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCalendar,
  FiClock,
  FiHome,
  FiLogOut,
  FiRefreshCw,
  FiTool,
  FiUser,
  FiDatabase,
} from 'react-icons/fi';
import { apiFetch, getStoredUser } from '../utils/api';
import ResourcesCatalogPage from '../features/resources/pages/ResourcesCatalogPage';

const PROFILE_KEY = 'studentProfile';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('OVERVIEW');
  const [notifications, setNotifications] = useState([]);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    studentId: '',
    department: '',
    batch: '',
    contactNumber: '',
  });

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
      setError(fetchError.message || 'Failed to load notifications');
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (!storedUser?.email) {
      navigate('/login');
      return;
    }

    setUser(storedUser);

    const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
    setProfile({
      fullName: savedProfile.fullName || storedUser.name || '',
      email: savedProfile.email || storedUser.email || '',
      studentId: savedProfile.studentId || '',
      department: savedProfile.department || '',
      batch: savedProfile.batch || '',
      contactNumber: savedProfile.contactNumber || '',
    });

    loadNotifications().finally(() => setLoading(false));
  }, [navigate, loadNotifications]);

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
      setError(updateError.message || 'Unable to mark all notifications as read');
    }
  };

  const updateProfileField = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!profile.fullName || !profile.email || !profile.studentId) {
      setError('Full name, email and student ID are required.');
      return;
    }

    const normalizedProfile = {
      ...profile,
      fullName: profile.fullName.trim(),
      email: profile.email.trim(),
      studentId: profile.studentId.trim(),
      department: profile.department.trim(),
      batch: profile.batch.trim(),
      contactNumber: profile.contactNumber.trim(),
    };

    localStorage.setItem(PROFILE_KEY, JSON.stringify(normalizedProfile));

    const updatedUser = {
      ...getStoredUser(),
      name: normalizedProfile.fullName,
      email: normalizedProfile.email,
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setSuccess('User profile saved successfully.');
  };

  const notificationStats = useMemo(() => {
    const unread = notifications.filter((entry) => !entry.read).length;
    const bookingAlerts = notifications.filter((entry) => entry.type === 'BOOKING').length;
    const ticketAlerts = notifications.filter((entry) => entry.type === 'TICKET').length;
    return { unread, bookingAlerts, ticketAlerts };
  }, [notifications]);

  const bookingAlerts = useMemo(
    () => notifications.filter((entry) => entry.type === 'BOOKING').slice(0, 6),
    [notifications]
  );

  const ticketAlerts = useMemo(
    () => notifications.filter((entry) => entry.type === 'TICKET').slice(0, 6),
    [notifications]
  );

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center text-slate-800">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-emerald-50/40 text-slate-800">
      <div className="flex min-h-screen">
        <aside className="w-72 bg-gradient-to-b from-blue-800 via-blue-700 to-cyan-700 border-r border-blue-200 px-4 py-6 hidden md:block">
          <h2 className="text-xl font-bold text-white px-2">Student Dashboard</h2>
          <p className="text-xs text-blue-100 px-2 mt-1">Member 4 Integration View</p>

          <nav className="mt-8 space-y-2">
            {[
              { id: 'OVERVIEW', label: 'Overview', icon: <FiHome /> },
              { id: 'RESOURCES_M1', label: 'Resource Catalog (M1)', icon: <FiDatabase /> },
              { id: 'NOTIFICATIONS', label: 'Notification Bell', icon: <FiBell /> },
              { id: 'PROFILE', label: 'User Profile', icon: <FiUser /> },
              { id: 'BOOKING_SUMMARY_M12', label: 'Booking Summary (M1/M2)', icon: <FiCalendar /> },
              { id: 'NEW_BOOKING_M2', label: 'New Booking Request (M2)', icon: <FiCalendar /> },
              { id: 'INCIDENT_REPORT_M3', label: 'Incident Reporting (M3)', icon: <FiTool /> },
              { id: 'MY_TICKETS_M3', label: 'My Tickets (M3)', icon: <FiClock /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                  activeSection === item.id
                    ? 'bg-emerald-300 text-slate-900 border-emerald-200 font-semibold'
                    : 'bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300'
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
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900">User Dashboard</h1>
              <p className="text-slate-600 mt-1">Notifications + profile + integration monitoring.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadNotifications}
                className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-cyan-50 transition flex items-center gap-2 text-slate-700"
              >
                <FiRefreshCw />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-cyan-50 transition flex items-center gap-2 text-slate-700"
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

          {success && (
            <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm">
              {success}
            </div>
          )}

          {activeSection === 'RESOURCES_M1' && (
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm mb-6">
              <ResourcesCatalogPage />
            </div>
          )}

          {activeSection === 'OVERVIEW' && (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <SummaryCard icon={<FiBell />} label="Unread Alerts" value={notificationStats.unread} />
              <SummaryCard icon={<FiCalendar />} label="Booking Alerts" value={notificationStats.bookingAlerts} />
              <SummaryCard icon={<FiTool />} label="Ticket Alerts" value={notificationStats.ticketAlerts} />
              <SummaryCard icon={<FiUser />} label="Role" value={user?.role || 'USER'} compact />
            </section>
          )}

          {activeSection === 'BOOKING_SUMMARY_M12' && (
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Booking Summary (Member 1/2 Integration)</h2>
                <p className="text-sm text-slate-600 mb-4">Member 1/2 module data appears here via BOOKING notifications.</p>
                <div className="space-y-3">
                  {bookingAlerts.map((entry) => (
                    <NotificationItem key={entry.id} entry={entry} />
                  ))}
                  {bookingAlerts.length === 0 && <p className="text-sm text-slate-600">No booking alerts received yet.</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Integration Status</h2>
                <p className="text-sm text-slate-700 leading-6">
                  This panel only displays booking workflow outputs from Member 1/2 APIs. Booking create/edit/cancel actions are handled
                  in Member 2 module and integrated here through alerts and status events.
                </p>
              </div>
            </section>
          )}

          {activeSection === 'NEW_BOOKING_M2' && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">New Booking Request (Member 2 Integration)</h2>
              <p className="text-sm text-slate-700 leading-6">
                Booking request form implementation belongs to Member 2 module. This dashboard integrates their outputs by reading
                BOOKING status notifications after request submission, approval, rejection, or cancellation.
              </p>
            </section>
          )}

          {activeSection === 'INCIDENT_REPORT_M3' && (
            <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Incident Reporting (Member 3 Integration)</h2>
                <p className="text-sm text-slate-700 leading-6">
                  Incident create form and attachment upload are implemented by Member 3. This Member 4 dashboard consumes the emitted
                  TICKET notifications and keeps users informed via alert center and notification bell.
                </p>
              </div>

              <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-3">Latest Ticket Alerts</h2>
                <div className="space-y-3">
                  {ticketAlerts.map((entry) => (
                    <NotificationItem key={entry.id} entry={entry} />
                  ))}
                  {ticketAlerts.length === 0 && <p className="text-sm text-slate-600">No ticket alerts received yet.</p>}
                </div>
              </div>
            </section>
          )}

          {activeSection === 'MY_TICKETS_M3' && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-3">My Tickets (Member 3 Integration)</h2>
              <p className="text-sm text-slate-600 mb-4">
                Ticket status timeline is integrated through TICKET notifications from Member 3 backend flow.
              </p>
              <div className="space-y-3">
                {ticketAlerts.map((entry) => (
                  <NotificationItem key={entry.id} entry={entry} />
                ))}
                {ticketAlerts.length === 0 && <p className="text-sm text-slate-600">No ticket status updates yet.</p>}
              </div>
            </section>
          )}

          {activeSection === 'NOTIFICATIONS' && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h2 className="text-xl font-semibold">Notification Bell Alerts</h2>
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-1.5 rounded-lg text-sm bg-emerald-300 text-slate-900 font-semibold"
                >
                  Mark all as read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((entry) => (
                  <div key={entry.id} className="rounded-xl p-4 border border-blue-100 bg-blue-50/60">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold">{entry.title}</p>
                      {!entry.read && (
                        <button
                          onClick={() => markAsRead(entry.id)}
                          className="px-3 py-1 text-xs rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mt-2">{entry.message}</p>
                    <p className="text-xs text-slate-500 mt-2">{entry.type || 'SYSTEM'} | {entry.createdAt || 'Date unavailable'}</p>
                  </div>
                ))}
                {notifications.length === 0 && <p className="text-sm text-slate-600">No alerts currently.</p>}
              </div>
            </section>
          )}

          {activeSection === 'PROFILE' && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-2">User Profile</h2>
              <p className="text-sm text-slate-600 mb-5">Member 4 profile section with Google login details.</p>

              <form onSubmit={saveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
                <InputField label="Full Name" value={profile.fullName} onChange={(value) => updateProfileField('fullName', value)} required />
                <InputField label="Email" type="email" value={profile.email} onChange={(value) => updateProfileField('email', value)} required />
                <InputField label="Student ID" value={profile.studentId} onChange={(value) => updateProfileField('studentId', value)} required />
                <InputField label="Department" value={profile.department} onChange={(value) => updateProfileField('department', value)} />
                <InputField label="Batch" value={profile.batch} onChange={(value) => updateProfileField('batch', value)} />
                <InputField label="Contact Number" value={profile.contactNumber} onChange={(value) => updateProfileField('contactNumber', value)} />

                <div className="md:col-span-2 rounded-xl border border-blue-100 bg-blue-50/60 p-3 text-xs text-slate-700">
                  Google Login Account: {user?.email || 'Unavailable'}
                </div>

                <div className="md:col-span-2">
                  <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-300 text-slate-900 font-semibold hover:bg-emerald-400 transition">
                    Save Profile
                  </button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, required = false, type = 'text' }) => (
  <div>
    <label className="block text-sm text-slate-700 mb-1 font-medium">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl bg-white border border-blue-100 px-3 py-2"
      required={required}
    />
  </div>
);

const SummaryCard = ({ icon, label, value, compact = false }) => (
  <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between text-slate-600">
      <span className="text-sm">{label}</span>
      <span>{icon}</span>
    </div>
    <p className={`font-bold mt-2 text-blue-900 ${compact ? 'text-lg' : 'text-3xl'}`}>{value}</p>
  </div>
);

const NotificationItem = ({ entry }) => (
  <div className="rounded-xl p-4 border border-blue-100 bg-blue-50/60">
    <p className="font-semibold">{entry.title}</p>
    <p className="text-sm text-slate-700 mt-1">{entry.message}</p>
    <p className="text-xs text-slate-500 mt-2">{entry.createdAt || 'Date unavailable'}</p>
  </div>
);

export default UserDashboard;
