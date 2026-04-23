import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiBell,
  FiCalendar,
  FiClock,
  FiDatabase,
  FiDownload,
  FiEdit2,
  FiFileText,
  FiHome,
  FiImage,
  FiLogOut,
  FiMenu,
  FiPlusCircle,
  FiRefreshCw,
  FiSearch,
  FiSettings,
  FiTool,
  FiTrash2,
  FiUser,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { apiFetch, getStoredUser } from '../utils/api';
import AdminResourceManagementPage from '../features/resources/pages/AdminResourceManagementPage';

const ROLE_OPTIONS = ['STUDENT', 'LECTURER', 'TECHNICIAN', 'ADMIN'];
const AUDIT_LOG_STORAGE_KEY = 'adminAuditLogs';
const DEMO_USERS = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'STUDENT',
    provider: 'local',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'LECTURER',
    provider: 'local',
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'ADMIN',
    provider: 'local',
  },
  {
    name: 'Tech Support',
    email: 'tech@example.com',
    role: 'TECHNICIAN',
    provider: 'local',
  },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    email: '',
    name: '',
    role: 'STUDENT',
  });
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT',
  });
  const [notificationForm, setNotificationForm] = useState({
    userEmail: '',
    type: 'SYSTEM',
    title: '',
    message: '',
    relatedId: '',
  });

  const [auditLogs, setAuditLogs] = useState([]);

  const pushAuditLog = useCallback((action, details) => {
    const actor = getStoredUser();
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      action,
      details,
      actor: actor?.email || 'admin',
      timestamp: new Date().toISOString(),
    };

    setAuditLogs((prev) => {
      const next = [entry, ...prev].slice(0, 50);
      localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

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

    if (storedUser.role !== 'ADMIN') {
      navigate('/dashboard');
      return;
    }

    setUser(storedUser);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (!raw) {
      setAuditLogs([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw);
      setAuditLogs(Array.isArray(parsed) ? parsed : []);
    } catch (parseError) {
      setAuditLogs([]);
    }
  }, []);

  const loadAdminData = useCallback(async () => {
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const [statsResult, usersResult] = await Promise.allSettled([
        apiFetch('/api/admin/stats'),
        apiFetch('/api/admin/users'),
      ]);

      const statsResponse = statsResult.status === 'fulfilled' ? statsResult.value : null;
      const usersResponse = usersResult.status === 'fulfilled' ? usersResult.value : null;

      const backendUsers = Array.isArray(usersResponse?.users) ? usersResponse.users : [];
      const hasBackendUsers = backendUsers.length > 0;

      setStats(statsResponse?.stats || null);
      setUsers(hasBackendUsers ? backendUsers : DEMO_USERS);

      if (hasBackendUsers) {
        setMessage('Dashboard data refreshed.');
      } else {
        setMessage('');
      }
    } catch (fetchError) {
      setUsers(DEMO_USERS);
      setMessage('');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      loadAdminData();
      pushAuditLog('ADMIN_LOGIN', 'Admin dashboard session opened');
    }
  }, [loading, user, loadAdminData, pushAuditLog]);

  const handleDeleteUser = async (email) => {
    const shouldDelete = window.confirm(`Delete user ${email}?`);
    if (!shouldDelete) {
      return;
    }

    try {
      setError('');
      await apiFetch(`/api/admin/users/${encodeURIComponent(email)}`, {
        method: 'DELETE',
      });

      setUsers((prev) => prev.filter((entry) => entry.email !== email));
      setMessage('User deleted successfully.');
      pushAuditLog('DELETE_USER', `Deleted user ${email}`);
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete user');
    }
  };

  const handleRoleChange = async (email, role) => {
    try {
      setError('');
      await apiFetch(`/api/admin/users/${encodeURIComponent(email)}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role }),
      });

      setUsers((prev) =>
        prev.map((entry) => (entry.email === email ? { ...entry, role } : entry))
      );
      setMessage(`Role updated for ${email}.`);
      pushAuditLog('UPDATE_ROLE', `Updated role of ${email} to ${role}`);
    } catch (roleError) {
      setError(roleError.message || 'Unable to update role');
    }
  };

  const startEditUser = (entry) => {
    setEditingUser(entry.email);
    setEditForm({
      email: entry.email,
      name: entry.name || '',
      role: entry.role || 'STUDENT',
    });
    setMessage('');
    setError('');
  };

  const cancelEditUser = () => {
    setEditingUser(null);
    setEditForm({ email: '', name: '', role: 'STUDENT' });
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    if (!editForm.email) {
      setError('Select a user to edit first.');
      return;
    }

    try {
      await handleRoleChange(editForm.email, editForm.role);
      setEditingUser(null);
      setEditForm({ email: '', name: '', role: 'STUDENT' });
      setMessage(`User ${editForm.email} updated successfully.`);
    } catch (submitError) {
      setError(submitError.message || 'Unable to update user');
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setError('');

    if (!createForm.name || !createForm.email || !createForm.password) {
      setError('Name, email and password are required.');
      return;
    }

    try {
      await apiFetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: createForm.name,
          email: createForm.email,
          password: createForm.password,
        }),
      });

      if (createForm.role !== 'STUDENT') {
        await apiFetch(`/api/admin/users/${encodeURIComponent(createForm.email)}/role`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ role: createForm.role }),
        });
      }

      setCreateForm({
        name: '',
        email: '',
        password: '',
        role: 'STUDENT',
      });

      await loadAdminData();
      setMessage('New user account created.');
      pushAuditLog('CREATE_USER', `Created user ${createForm.email}`);
    } catch (createError) {
      setError(createError.message || 'Unable to create user');
    }
  };

  const handleSearchUser = async (event) => {
    event.preventDefault();
    setError('');

    if (!searchEmail) {
      setError('Enter an email to search.');
      return;
    }

    try {
      const response = await apiFetch(`/api/admin/users/${encodeURIComponent(searchEmail)}`);
      setSelectedUser(response.user || null);
      setMessage('User found.');
      pushAuditLog('READ_USER', `Viewed profile for ${searchEmail}`);
    } catch (searchError) {
      setSelectedUser(null);
      setError(searchError.message || 'Search failed');
    }
  };

  const handleNotificationSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!notificationForm.userEmail || !notificationForm.title || !notificationForm.message) {
      setError('Recipient email, title and message are required.');
      return;
    }

    try {
      await apiFetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationForm),
      });

      setNotificationForm({
        userEmail: '',
        type: 'SYSTEM',
        title: '',
        message: '',
        relatedId: '',
      });

      setMessage('System notification sent.');
      pushAuditLog(
        'SEND_NOTIFICATION',
        `Sent ${notificationForm.type} notification to ${notificationForm.userEmail}`
      );
    } catch (submitError) {
      setError(submitError.message || 'Unable to send notification');
    }
  };

  const downloadFile = (content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const generateCsvReport = () => {
    const headers = ['Name', 'Email', 'Role', 'Provider', 'CreatedAt'];
    const rows = users.map((entry) => [
      entry.name || '',
      entry.email || '',
      entry.role || '',
      entry.provider || '',
      entry.createdAt || '',
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');

    downloadFile(csv, `admin-users-${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv');
    pushAuditLog('EXPORT_REPORT', 'Exported user CSV report');
  };

  const generateJsonReport = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      generatedBy: user?.email || 'admin',
      stats,
      users,
      auditLogs,
    };

    downloadFile(
      JSON.stringify(payload, null, 2),
      `admin-summary-${new Date().toISOString().slice(0, 10)}.json`,
      'application/json'
    );
    pushAuditLog('EXPORT_REPORT', 'Exported summary JSON report');
  };

  const overviewCards = useMemo(
    () => [
      {
        title: 'Total Resources',
        value: 'Integration Pending',
        owner: 'Member 1',
        tone: 'text-amber-300',
      },
      {
        title: 'Pending Bookings',
        value: 'Integration Pending',
        owner: 'Member 2',
        tone: 'text-amber-300',
      },
      {
        title: 'Open Tickets',
        value: 'Integration Pending',
        owner: 'Member 3',
        tone: 'text-amber-300',
      },
      {
        title: 'Total Users',
        value: stats?.totalUsers ?? users.length,
        owner: 'Member 4',
        tone: 'text-cyan-300',
      },
    ],
    [stats, users.length]
  );

  const navItems = [
    { key: 'home', label: 'Home', icon: <FiHome /> },
    { key: 'resources', label: 'Resources', icon: <FiDatabase /> },
    { key: 'bookings', label: 'Bookings', icon: <FiCalendar /> },
    { key: 'tickets', label: 'Tickets', icon: <FiTool /> },
    { key: 'users', label: 'Users', icon: <FiUsers /> },
    { key: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { key: 'audit', label: 'Audit Logs', icon: <FiClock /> },
    { key: 'reports', label: 'Reports', icon: <FiFileText /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-rose-50/40 flex items-center justify-center text-slate-800">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-rose-50/40 text-slate-800 flex">
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } transition-all duration-300 overflow-hidden border-r border-blue-200 bg-gradient-to-b from-blue-800 via-blue-700 to-cyan-600`}
      >
        <div className="p-5 border-b border-blue-300/40">
          <h2 className="text-xl font-bold text-white">Campus Admin Hub</h2>
          <p className="text-xs text-blue-50/90 mt-1">Group 177 Integrated Console</p>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center gap-3 ${
                activeSection === item.key
                  ? 'bg-white text-blue-800 font-semibold border border-blue-100'
                  : 'bg-blue-700/40 text-blue-50 hover:bg-blue-700/60 border border-blue-300/30'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-8">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50"
            >
              {sidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">
                Welcome {user?.name || 'Admin'} | Role: {user?.role || 'ADMIN'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-3 rounded-xl bg-white border border-slate-200">
              <FiBell />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-600"></span>
            </button>
            <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm flex items-center gap-2 text-slate-700">
              <FiUser />
              {user?.email || 'admin@local'}
            </div>
            <button
              onClick={loadAdminData}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2"
            >
              <FiRefreshCw />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition flex items-center gap-2"
            >
              <FiLogOut />
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-900 text-sm">
            {error}
          </div>
        )}
        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900 text-sm">
            {message}
          </div>
        )}

        {activeSection === 'home' && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {overviewCards.map((card) => (
                <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-slate-500 text-sm">{card.title}</p>
                  <p className={`text-2xl font-bold mt-2 ${card.tone}`}>{card.value}</p>
                  <p className="text-xs text-slate-500 mt-2">Owner: {card.owner}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold">Team Integration Map</h2>
              <p className="text-sm text-slate-600 mt-2">
                Member 4 section is fully functional. Member 1, 2, and 3 sections are integration-ready panels.
              </p>
            </div>
          </section>
        )}

        {activeSection === 'resources' && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <AdminResourceManagementPage />
          </div>
        )}

        {activeSection === 'bookings' && (
          <IntegrationPanel
            title="Member 2 - Booking Management"
            description="Pending booking requests, approve/reject actions, and master calendar panel integration point."
            endpointGuide={[
              'GET /api/bookings?status=PENDING',
              'PUT /api/bookings/{id}/approve',
              'PUT /api/bookings/{id}/reject',
              'GET /api/bookings/calendar',
            ]}
          />
        )}

        {activeSection === 'tickets' && (
          <IntegrationPanel
            title="Member 3 - Maintenance and Tickets"
            description="Ticket inbox, technician assignment, and evidence image viewer can be plugged into this panel."
            endpointGuide={[
              'GET /api/tickets?status=OPEN',
              'PUT /api/tickets/{id}/assign',
              'PUT /api/tickets/{id}/status',
              'GET /api/tickets/{id}/attachments',
            ]}
            icon={<FiImage />}
          />
        )}

        {activeSection === 'users' && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Total Users</p>
                <p className="text-2xl font-bold text-blue-800 mt-2">{stats?.totalUsers ?? users.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Admins</p>
                <p className="text-2xl font-bold mt-2 text-slate-900">{stats?.adminCount ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Students</p>
                <p className="text-2xl font-bold mt-2 text-slate-900">{stats?.studentCount ?? 0}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs text-slate-500">Technicians</p>
                <p className="text-2xl font-bold mt-2 text-slate-900">{stats?.technicianCount ?? 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-semibold mb-4">User Management Table</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-600">
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-2">Email</th>
                        <th className="text-left py-3 px-2">Role</th>
                        <th className="text-left py-3 px-2">Provider</th>
                        <th className="text-left py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((entry) => (
                        <tr key={entry.email} className="border-b border-slate-100 hover:bg-slate-50 transition">
                          <td className="py-3 px-2">{entry.name || 'N/A'}</td>
                          <td className="py-3 px-2 text-slate-700">{entry.email}</td>
                          <td className="py-3 px-2">
                            <span className="px-3 py-1 rounded-full text-xs border border-blue-200 bg-blue-50 text-blue-700">
                              {entry.role || 'STUDENT'}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-slate-400">{entry.provider || 'local'}</td>
                          <td className="py-3 px-2 flex items-center gap-2">
                            <button
                              onClick={() => startEditUser(entry)}
                              className="p-2 rounded-lg border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                              title="Edit user"
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(entry.email)}
                              className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                              title="Delete user"
                            >
                              <FiTrash2 />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {!busy && users.length === 0 && (
                  <p className="text-slate-500 text-sm mt-4">No users returned from backend.</p>
                )}
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FiEdit2 />
                    Edit User
                  </h3>
                  {editingUser ? (
                    <form className="space-y-3 mb-6" onSubmit={handleEditSubmit}>
                      <input
                        type="text"
                        value={editForm.name}
                        disabled
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                      />
                      <input
                        type="email"
                        value={editForm.email}
                        disabled
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500"
                      />
                      <select
                        value={editForm.role}
                        onChange={(event) => setEditForm((prev) => ({ ...prev, role: event.target.value }))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        {ROLE_OPTIONS.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 rounded-xl bg-blue-700 text-white px-4 py-2 font-semibold hover:bg-blue-800">
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={cancelEditUser}
                          className="flex-1 rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="text-sm text-slate-600 mb-6">Select a user from the table and click edit.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FiPlusCircle />
                    Create User
                  </h3>
                  <form className="space-y-3" onSubmit={handleCreateUser}>
                    <input
                      type="text"
                      placeholder="Full name"
                      value={createForm.name}
                      onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={createForm.email}
                      onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={createForm.password}
                      onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                    <select
                      value={createForm.role}
                      onChange={(event) => setCreateForm((prev) => ({ ...prev, role: event.target.value }))}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                    <button type="submit" className="w-full rounded-xl bg-blue-700 text-white px-4 py-2 font-semibold hover:bg-blue-800">
                      Create Account
                    </button>
                  </form>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FiSearch />
                    Search User
                  </h3>
                  <form className="space-y-3" onSubmit={handleSearchUser}>
                    <input
                      type="email"
                      placeholder="Search by email"
                      value={searchEmail}
                      onChange={(event) => setSearchEmail(event.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    />
                    <button type="submit" className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50">
                      Find User
                    </button>
                  </form>

                  {selectedUser && (
                    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm space-y-1">
                      <p>Name: {selectedUser.name || 'N/A'}</p>
                      <p>Email: {selectedUser.email || 'N/A'}</p>
                      <p>Role: {selectedUser.role || 'N/A'}</p>
                      <p>Provider: {selectedUser.provider || 'N/A'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'notifications' && (
          <section className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">Member 4 - System Notifications</h2>
            <form className="space-y-3" onSubmit={handleNotificationSubmit}>
              <input
                type="email"
                placeholder="Recipient email"
                value={notificationForm.userEmail}
                onChange={(event) =>
                  setNotificationForm((prev) => ({ ...prev, userEmail: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />

              <select
                value={notificationForm.type}
                onChange={(event) =>
                  setNotificationForm((prev) => ({ ...prev, type: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              >
                <option value="SYSTEM">SYSTEM</option>
                <option value="BOOKING">BOOKING</option>
                <option value="TICKET">TICKET</option>
                <option value="COMMENT">COMMENT</option>
              </select>

              <input
                type="text"
                placeholder="Title"
                value={notificationForm.title}
                onChange={(event) =>
                  setNotificationForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />

              <textarea
                rows={4}
                placeholder="Message"
                value={notificationForm.message}
                onChange={(event) =>
                  setNotificationForm((prev) => ({ ...prev, message: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />

              <input
                type="text"
                placeholder="Related ID (optional)"
                value={notificationForm.relatedId}
                onChange={(event) =>
                  setNotificationForm((prev) => ({ ...prev, relatedId: event.target.value }))
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-700 text-white px-4 py-2 font-semibold hover:bg-blue-800"
              >
                Send Notification
              </button>
            </form>
          </section>
        )}

        {activeSection === 'audit' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-semibold mb-4">Member 4 - Audit Logs</h2>
            <div className="space-y-3">
              {auditLogs.map((log) => (
                <div key={log.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold">{log.action}</p>
                    <p className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-slate-700 mt-1">{log.details}</p>
                  <p className="text-xs text-slate-500 mt-1">Actor: {log.actor}</p>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <p className="text-sm text-slate-600">No audit logs yet.</p>
              )}
            </div>
          </section>
        )}

        {activeSection === 'reports' && (
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-semibold mb-3">Report Generation</h2>
              <p className="text-sm text-slate-600 mb-4">
                Export admin evidence files for viva and final report.
              </p>
              <div className="space-y-3">
                <button
                  onClick={generateCsvReport}
                  className="w-full rounded-xl bg-blue-700 text-white px-4 py-2 font-semibold flex items-center justify-center gap-2 hover:bg-blue-800"
                >
                  <FiDownload />
                  Export Users CSV
                </button>
                <button
                  onClick={generateJsonReport}
                  className="w-full rounded-xl bg-white border border-slate-200 px-4 py-2 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50"
                >
                  <FiDownload />
                  Export Summary JSON
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <FiSettings />
                Snapshot
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p>Total Users: {stats?.totalUsers ?? users.length}</p>
                <p>Admins: {stats?.adminCount ?? 0}</p>
                <p>Students: {stats?.studentCount ?? 0}</p>
                <p>Lecturers: {stats?.lecturerCount ?? 0}</p>
                <p>Technicians: {stats?.technicianCount ?? 0}</p>
                <p>Audit Entries: {auditLogs.length}</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

const IntegrationPanel = ({ title, description, endpointGuide, icon = <FiDatabase /> }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6">
    <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
      {icon}
      {title}
    </h2>
    <p className="text-sm text-slate-600 mb-4">{description}</p>

    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
      <p className="text-sm font-semibold text-blue-900 mb-2">Integration Contract</p>
      <div className="space-y-2 text-sm text-blue-900">
        {endpointGuide.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </div>
  </section>
);

export default AdminDashboard;
