import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiBell, FiUser, FiLogOut, FiSettings, FiUsers, FiMenu, FiX, FiBarChart2, FiActivity, FiTrash2 } from 'react-icons/fi';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('Home');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'STUDENT', status: 'Active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'LECTURER', status: 'Active' },
    { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'ADMIN', status: 'Active' },
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    
    // Check if user is admin
    if (userData.role !== 'ADMIN' && userData.role !== 'TECHNICIAN') {
      navigate('/dashboard');
      return;
    }
    
    setUser(userData);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDeleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="text-white text-xl">Access Denied</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex text-white font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white bg-opacity-5 backdrop-blur-md border-r border-white border-opacity-10 p-6 flex flex-col justify-between transition-all duration-300 overflow-hidden`}>
        <div>
          <div className="mb-10 px-2"><h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">Admin Hub</h1></div>
          <nav className="space-y-4">
            <NavItem icon={<FiHome />} label="Dashboard" active={activeNav === 'Home'} onClick={() => setActiveNav('Home')} />
            <NavItem icon={<FiUsers />} label="Users" active={activeNav === 'Users'} onClick={() => setActiveNav('Users')} />
            <NavItem icon={<FiBarChart2 />} label="Analytics" active={activeNav === 'Analytics'} onClick={() => setActiveNav('Analytics')} />
            <NavItem icon={<FiActivity />} label="Activity" active={activeNav === 'Activity'} onClick={() => setActiveNav('Activity')} />
            <NavItem icon={<FiSettings />} label="Settings" active={activeNav === 'Settings'} onClick={() => setActiveNav('Settings')} />
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded-xl transition w-full"><FiLogOut /> <span>Logout</span></button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mb-4 p-2 bg-white bg-opacity-5 rounded-lg">{sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}</button>

        {/* Hero Section with Professional Image */}
        <div className="mb-10 rounded-3xl overflow-hidden border border-white border-opacity-10 shadow-2xl h-64 md:h-72 bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 relative">
          <div 
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3Cpattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 20 0 L 0 0 0 20" fill="none" stroke="white" stroke-width="0.5"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="url(%23grid)" /%3E%3C/svg%3E")',
              backgroundSize: '100px 100px'
            }}
          ></div>
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
          <div className="relative h-full flex flex-col justify-between p-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Admin Control Hub</h1>
              <p className="text-lg md:text-xl text-gray-100">Monitor, manage, and optimize your campus ecosystem</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-30">
                <p className="text-sm text-gray-200">Total Users</p>
                <p className="text-2xl font-bold text-white">156</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-30">
                <p className="text-sm text-gray-200">Active Sessions</p>
                <p className="text-2xl font-bold text-white">42</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-30">
                <p className="text-sm text-gray-200">System Health</p>
                <p className="text-2xl font-bold text-white">98%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Path */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <span className="text-slate-400">📍 Admin Hub</span>
          <span className="text-slate-600">/</span>
          <span className={`${activeNav === 'Home' ? 'text-red-400 font-semibold' : 'text-slate-400'}`}>
            {activeNav === 'Home' ? 'Dashboard' : activeNav === 'Users' ? 'Users' : activeNav === 'Analytics' ? 'Analytics' : activeNav === 'Activity' ? 'Activity' : activeNav === 'Settings' ? 'Settings' : 'Dashboard'}
          </span>
        </nav>

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-semibold">Admin Dashboard</h2>
            <p className="text-slate-400">Welcome back, {user?.name}!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative p-2 bg-white bg-opacity-5 rounded-full border border-white border-opacity-10 cursor-pointer hover:bg-opacity-10 transition"><FiBell size={20} /><span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0f172a]"></span></div>
            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'Admin'}&background=DC2626&color=fff`} alt="Profile" className="w-12 h-12 rounded-full border-2 border-red-500 p-0.5" />
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value="156" color="from-blue-500 to-cyan-500" />
          <StatCard title="Active Sessions" value="42" color="from-green-500 to-emerald-500" />
          <StatCard title="System Health" value="98%" color="from-purple-500 to-pink-500" />
          <StatCard title="New Registrations" value="12" color="from-orange-500 to-yellow-500" />
        </div>

        {/* Content Based on Active Nav */}
        {activeNav === 'Home' && (
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
              <h3 className="text-xl font-medium mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <ActivityRow icon="👤" text="New user registration" user="John Doe" time="5 mins ago" />
                <ActivityRow icon="✅" text="User verified email" user="Jane Smith" time="1 hour ago" />
                <ActivityRow icon="⚙️" text="System maintenance completed" user="System" time="3 hours ago" />
              </div>
            </div>
          </div>
        )}

        {activeNav === 'Users' && (
          <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
            <h3 className="text-xl font-medium mb-6">User Management</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white border-opacity-10">
                    <th className="text-left py-3 px-4 text-slate-300">Name</th>
                    <th className="text-left py-3 px-4 text-slate-300">Email</th>
                    <th className="text-left py-3 px-4 text-slate-300">Role</th>
                    <th className="text-left py-3 px-4 text-slate-300">Status</th>
                    <th className="text-left py-3 px-4 text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-white border-opacity-5 hover:bg-white hover:bg-opacity-5 transition">
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4 text-slate-400">{u.email}</td>
                      <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-sm ${u.role === 'ADMIN' ? 'bg-red-500' : u.role === 'LECTURER' ? 'bg-blue-500' : 'bg-green-500'} bg-opacity-20`}>{u.role}</span></td>
                      <td className="py-3 px-4"><span className="px-3 py-1 rounded-full text-sm bg-green-500 bg-opacity-20">{u.status}</span></td>
                      <td className="py-3 px-4 flex gap-2">
                        <button className="p-2 bg-blue-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"><FiUser size={16} /></button>
                        <button onClick={() => handleDeleteUser(u.id)} className="p-2 bg-red-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition"><FiTrash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeNav === 'Analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
              <h3 className="text-xl font-medium mb-6">User Growth</h3>
              <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <p className="text-white text-center">📊 Chart visualization would go here</p>
              </div>
            </div>
            <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
              <h3 className="text-xl font-medium mb-6">System Performance</h3>
              <div className="h-64 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
                <p className="text-white text-center">📈 Performance metrics</p>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'Activity' && (
          <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
            <h3 className="text-xl font-medium mb-6">System Activity Log</h3>
            <div className="space-y-3">
              <LogEntry time="14:46" event="Backend server restarted" status="success" />
              <LogEntry time="14:30" event="User john@example.com logged in" status="success" />
              <LogEntry time="14:15" event="Database backup completed" status="success" />
              <LogEntry time="14:00" event="Security scan executed" status="warning" />
              <LogEntry time="13:45" event="API rate limit triggered" status="error" />
            </div>
          </div>
        )}

        {activeNav === 'Settings' && (
          <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
            <h3 className="text-xl font-medium mb-6">System Settings</h3>
            <div className="space-y-4">
              <SettingItem label="Maintenance Mode" value="Off" />
              <SettingItem label="User Registration" value="Enabled" />
              <SettingItem label="Email Verification" value="Required" />
              <SettingItem label="Two-Factor Auth" value="Optional" />
              <SettingItem label="API Rate Limit" value="1000/hour" />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick = () => {} }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition ${active ? 'bg-red-600 text-white shadow-lg shadow-red-500/30' : 'text-slate-400 hover:bg-white hover:bg-opacity-5 hover:text-white'}`}>
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </div>
);

const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-3xl bg-gradient-to-br ${color} shadow-lg hover:shadow-xl transition`}>
    <p className="text-white text-opacity-80 text-sm mb-1">{title}</p>
    <h4 className="text-3xl font-bold text-white">{value}</h4>
  </div>
);

const ActivityRow = ({ icon, text, user, time }) => (
  <div className="flex justify-between items-center p-4 rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-5 hover:bg-opacity-10 transition">
    <div className="flex items-center gap-4">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="text-slate-300 font-medium">{text}</p>
        <p className="text-xs text-slate-500">By: {user}</p>
      </div>
    </div>
    <span className="text-sm text-slate-500">{time}</span>
  </div>
);

const LogEntry = ({ time, event, status }) => (
  <div className={`flex justify-between items-center p-4 rounded-2xl border border-white border-opacity-10 ${status === 'success' ? 'bg-green-500/10' : status === 'warning' ? 'bg-yellow-500/10' : 'bg-red-500/10'}`}>
    <div>
      <p className="text-slate-300 font-medium">{event}</p>
      <p className="text-xs text-slate-500">{time}</p>
    </div>
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'success' ? 'bg-green-500 bg-opacity-20 text-green-300' : status === 'warning' ? 'bg-yellow-500 bg-opacity-20 text-yellow-300' : 'bg-red-500 bg-opacity-20 text-red-300'}`}>
      {status.toUpperCase()}
    </span>
  </div>
);

const SettingItem = ({ label, value }) => (
  <div className="flex justify-between items-center p-4 rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-5 hover:bg-opacity-10 transition cursor-pointer">
    <span className="text-slate-300">{label}</span>
    <span className="px-4 py-2 bg-blue-500 bg-opacity-20 rounded-lg text-blue-300 font-medium">{value}</span>
  </div>
);

export default AdminDashboard;
