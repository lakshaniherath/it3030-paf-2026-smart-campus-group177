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
  FiGrid,
} from 'react-icons/fi';
import { apiFetch, getStoredUser } from '../utils/api';

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
              { id: 'NOTIFICATIONS', label: 'Notification Bell', icon: <FiBell /> },
              { id: 'PROFILE', label: 'User Profile', icon: <FiUser /> },
              { id: 'RESOURCES_M1', label: 'Browse Resources (M1)', icon: <FiGrid /> },
              { id: 'BOOKINGS_M2', label: 'My Bookings (M2)', icon: <FiCalendar /> },
              { id: 'INCIDENT_REPORT_M3', label: 'Report Incident (M3)', icon: <FiTool /> },
              { id: 'MY_TICKETS_M3', label: 'My Tickets (M3)', icon: <FiClock /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => item.id === 'RESOURCES_M1' ? navigate('/resources') : item.id === 'BOOKINGS_M2' ? navigate('/bookings') : item.id === 'INCIDENT_REPORT_M3' ? navigate('/tickets/create') : item.id === 'MY_TICKETS_M3' ? navigate('/tickets') : setActiveSection(item.id)}
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

          {activeSection === 'OVERVIEW' && (
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <SummaryCard icon={<FiBell />} label="Unread Alerts" value={notificationStats.unread} />
              <SummaryCard icon={<FiCalendar />} label="Booking Alerts" value={notificationStats.bookingAlerts} />
              <SummaryCard icon={<FiTool />} label="Ticket Alerts" value={notificationStats.ticketAlerts} />
              <SummaryCard icon={<FiUser />} label="Role" value={user?.role || 'USER'} compact />
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
                <div>
                  <h2 className="text-xl font-semibold">Notification Bell Alerts</h2>
                  <p className="text-sm text-slate-500 mt-1">
                    {notifications.length} total notification{notifications.length !== 1 ? 's' : ''} 
                    {notificationStats.unread > 0 && ` • ${notificationStats.unread} unread`}
                  </p>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 rounded-xl text-sm bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition"
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {notifications.map((entry) => {
                  const getIcon = (type) => {
                    switch (type) {
                      case 'BOOKING': return '📅';
                      case 'TICKET': return '🔧';
                      case 'COMMENT': return '💬';
                      default: return '📢';
                    }
                  };
                  
                  const formatTime = (date) => {
                    if (!date) return 'Date unavailable';
                    const now = new Date();
                    const notifDate = new Date(date);
                    const diffMs = now - notifDate;
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMs / 3600000);
                    const diffDays = Math.floor(diffMs / 86400000);

                    if (diffMins < 1) return 'Just now';
                    if (diffMins < 60) return `${diffMins}m ago`;
                    if (diffHours < 24) return `${diffHours}h ago`;
                    if (diffDays < 7) return `${diffDays}d ago`;
                    return notifDate.toLocaleDateString();
                  };
                  
                  return (
                    <div 
                      key={entry.id} 
                      className={`rounded-xl p-4 border transition ${
                        entry.read 
                          ? 'border-blue-100 bg-white' 
                          : 'border-cyan-200 bg-cyan-50/50 border-l-4 border-l-cyan-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0 mt-0.5">
                          {getIcon(entry.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-slate-800">{entry.title}</p>
                              <p className="text-sm text-slate-600 mt-1">{entry.message}</p>
                            </div>
                            {!entry.read && (
                              <button
                                onClick={() => markAsRead(entry.id)}
                                className="px-3 py-1 text-xs rounded-lg bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition flex-shrink-0"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">
                              {entry.type || 'SYSTEM'}
                            </span>
                            <span>{formatTime(entry.createdAt)}</span>
                            {!entry.read && (
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                                Unread
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {notifications.length === 0 && (
                  <div className="text-center py-12">
                    <FiBell className="mx-auto text-slate-300 mb-3" size={48} />
                    <p className="text-slate-600 font-semibold">No alerts currently.</p>
                    <p className="text-slate-400 text-sm mt-1">
                      You'll receive notifications here when bookings are approved/rejected or ticket statuses change.
                    </p>
                  </div>
                )}
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
