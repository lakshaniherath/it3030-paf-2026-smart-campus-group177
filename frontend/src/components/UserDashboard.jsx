import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiBell, FiUser, FiLogOut, FiSettings, FiBook, FiMenu, FiX, FiCheckCircle } from 'react-icons/fi';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNav, setActiveNav] = useState('Home');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    setUser(userData);
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>;
  }

  if (!user) {
    return <div className="min-h-screen bg-[#0f172a] flex items-center justify-center"><div className="text-white text-xl">Please log in first</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex text-white font-sans">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white bg-opacity-5 backdrop-blur-md border-r border-white border-opacity-10 p-6 flex flex-col justify-between transition-all duration-300 overflow-hidden`}>
        <div>
          <div className="mb-10 px-2"><h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Smart Campus</h1></div>
          <nav className="space-y-4">
            <NavItem icon={<FiHome />} label="Home" active={activeNav === 'Home'} onClick={() => setActiveNav('Home')} />
            <NavItem icon={<FiBook />} label="My Courses" active={activeNav === 'Courses'} onClick={() => setActiveNav('Courses')} />
            <NavItem icon={<FiCheckCircle />} label="Tasks" active={activeNav === 'Tasks'} onClick={() => setActiveNav('Tasks')} />
            <NavItem icon={<FiBell />} label="Notifications" active={activeNav === 'Notifications'} onClick={() => setActiveNav('Notifications')} />
            <NavItem icon={<FiUser />} label="Profile" active={activeNav === 'Profile'} onClick={() => setActiveNav('Profile')} />
            <NavItem icon={<FiSettings />} label="Settings" active={activeNav === 'Settings'} onClick={() => setActiveNav('Settings')} />
          </nav>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded-xl transition w-full"><FiLogOut /> <span>Logout</span></button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mb-4 p-2 bg-white bg-opacity-5 rounded-lg">{sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}</button>

        {/* Hero Section with Professional Image */}
        <div className="mb-10 rounded-3xl overflow-hidden border border-white border-opacity-10 shadow-2xl h-64 md:h-72 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative">
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
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">Welcome to Smart Campus</h1>
              <p className="text-lg md:text-xl text-gray-100">Your all-in-one platform for campus management and academic excellence</p>
            </div>
            <div className="flex gap-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-30">
                <p className="text-sm text-gray-200">Academic Year</p>
                <p className="text-2xl font-bold text-white">2025-26</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-30">
                <p className="text-sm text-gray-200">Active Courses</p>
                <p className="text-2xl font-bold text-white">4</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-lg p-4 border border-white border-opacity-30">
                <p className="text-sm text-gray-200">GPA</p>
                <p className="text-2xl font-bold text-white">3.8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb Path */}
        <nav className="mb-8 flex items-center gap-2 text-sm">
          <span className="text-slate-400">📍 Dashboard</span>
          <span className="text-slate-600">/</span>
          <span className={`${activeNav === 'Home' ? 'text-blue-400 font-semibold' : 'text-slate-400'}`}>
            {activeNav === 'Home' ? 'Home' : activeNav === 'Courses' ? 'My Courses' : activeNav === 'Tasks' ? 'Tasks' : activeNav === 'Notifications' ? 'Notifications' : activeNav === 'Profile' ? 'Profile' : activeNav === 'Settings' ? 'Settings' : 'Home'}
          </span>
        </nav>

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-semibold">Welcome back, {user?.name || 'User'}!</h2>
            <p className="text-slate-400">Here's what's happening in your campus hub.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative p-2 bg-white bg-opacity-5 rounded-full border border-white border-opacity-10 cursor-pointer hover:bg-opacity-10 transition"><FiBell size={20} /><span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0f172a]"></span></div>
            <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff`} alt="Profile" className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5" />
          </div>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Active Courses" value="4" color="from-blue-500 to-cyan-500" />
          <StatCard title="Pending Tasks" value="7" color="from-purple-500 to-pink-500" />
          <StatCard title="Overall GPA" value="3.8" color="from-emerald-500 to-teal-500" />
        </div>

        {/* Content Based on Active Nav */}
        {activeNav === 'Home' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* My Courses */}
            <div className="lg:col-span-2 bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
              <h3 className="text-xl font-medium mb-6">My Courses</h3>
              <div className="space-y-4">
                <CourseCard title="IT3030 - Web Development" progress={75} instructor="Dr. Smith" />
                <CourseCard title="IT2050 - Database Design" progress={60} instructor="Prof. Johnson" />
                <CourseCard title="IT2080 - Software Engineering" progress={85} instructor="Dr. Williams" />
                <CourseCard title="IT2100 - Mobile App Dev" progress={45} instructor="Prof. Brown" />
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
              <h3 className="text-xl font-medium mb-6">Upcoming</h3>
              <div className="space-y-3">
                <EventCard icon="📝" title="Assignment Due" date="Apr 22" />
                <EventCard icon="📚" title="Midterm Exam" date="Apr 25" />
                <EventCard icon="👥" title="Group Project" date="Apr 28" />
              </div>
            </div>
          </div>
        )}

        {activeNav === 'Courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CourseDetailCard title="IT3030 - Web Development" progress={75} instructor="Dr. Smith" description="Learn modern web development with React, Node.js, and MongoDB" />
            <CourseDetailCard title="IT2050 - Database Design" progress={60} instructor="Prof. Johnson" description="Master database design principles and SQL queries" />
            <CourseDetailCard title="IT2080 - Software Engineering" progress={85} instructor="Dr. Williams" description="Understand software development lifecycle and best practices" />
            <CourseDetailCard title="IT2100 - Mobile App Dev" progress={45} instructor="Prof. Brown" description="Build iOS and Android apps using modern frameworks" />
          </div>
        )}

        {activeNav === 'Tasks' && (
          <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
            <h3 className="text-xl font-medium mb-6">My Tasks</h3>
            <div className="space-y-3">
              <TaskItem title="Complete React Tutorial" dueDate="Today" status="pending" />
              <TaskItem title="Submit Assignment 3" dueDate="Tomorrow" status="pending" />
              <TaskItem title="Review Database Queries" dueDate="Apr 22" status="pending" />
              <TaskItem title="Prepare for Midterm" dueDate="Apr 25" status="pending" />
              <TaskItem title="Group Project Presentation" dueDate="Apr 28" status="pending" />
              <TaskItem title="Complete Quiz 5" dueDate="Apr 20" status="completed" />
            </div>
          </div>
        )}

        {activeNav === 'Notifications' && (
          <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
            <h3 className="text-xl font-medium mb-6">Notifications</h3>
            <div className="space-y-3">
              <NotificationItem type="info" title="Course Update" message="Dr. Smith posted new course materials for IT3030" time="2 hours ago" />
              <NotificationItem type="warning" title="Assignment Reminder" message="Assignment 3 is due tomorrow at 11:59 PM" time="5 hours ago" />
              <NotificationItem type="success" title="Grade Posted" message="Your Quiz 5 score is now available" time="1 day ago" />
              <NotificationItem type="info" title="System Update" message="Maintenance completed successfully" time="2 days ago" />
            </div>
          </div>
        )}

        {activeNav === 'Profile' && (
          <div className="max-w-2xl">
            <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8 space-y-6">
              <h3 className="text-xl font-medium">Profile Information</h3>
              
              <div className="flex items-center gap-6">
                <img src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff&size=120`} alt="Profile" className="w-32 h-32 rounded-full border-4 border-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{user?.name || 'User'}</p>
                  <p className="text-slate-400">{user?.email}</p>
                  <p className="text-sm text-slate-500 mt-2">Member since: Apr 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white border-opacity-10">
                <ProfileField label="Full Name" value={user?.name || 'N/A'} />
                <ProfileField label="Email" value={user?.email || 'N/A'} icon="📧" />
                <ProfileField label="Student ID" value="ST2024001" />
                <ProfileField label="Program" value="Bachelor of Information Technology" />
                <ProfileField label="Current Year" value="2nd Year" />
                <ProfileField label="GPA" value="3.8" />
                <ProfileField label="Password" value="••••••••" icon="🔐" subtitle="Click below to change" />
              </div>

              <div className="flex gap-4 pt-6 border-t border-white border-opacity-10">
                <button className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition">
                  Update Profile
                </button>
                <button className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition">
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}

        {activeNav === 'Settings' && (
          <div className="max-w-2xl">
            <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8 space-y-4">
              <h3 className="text-xl font-medium mb-6">User Settings</h3>
              <SettingToggle label="Email Notifications" enabled={true} />
              <SettingToggle label="Course Updates" enabled={true} />
              <SettingToggle label="Assignment Reminders" enabled={true} />
              <SettingToggle label="Marketing Emails" enabled={false} />
              <div className="pt-6 border-t border-white border-opacity-10">
                <button className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl font-semibold transition">Change Password</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, onClick = () => {} }) => (
  <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-white hover:bg-opacity-5 hover:text-white'}`}>
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

const CourseCard = ({ title, progress, instructor }) => (
  <div className="p-4 bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 hover:bg-opacity-10 transition">
    <div className="flex justify-between items-start mb-3">
      <div>
        <p className="font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-400">Instructor: {instructor}</p>
      </div>
      <span className="text-sm font-bold text-blue-400">{progress}%</span>
    </div>
    <div className="w-full h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${progress}%` }}></div>
    </div>
  </div>
);

const EventCard = ({ icon, title, date }) => (
  <div className="p-3 bg-white bg-opacity-5 rounded-2xl border border-white border-opacity-10 hover:bg-opacity-10 transition">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="text-xs text-slate-500">{date}</p>
      </div>
    </div>
  </div>
);

const CourseDetailCard = ({ title, progress, instructor, description }) => (
  <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-6 hover:bg-opacity-10 transition">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-slate-400 mb-4">{instructor}</p>
    <p className="text-sm text-slate-300 mb-4">{description}</p>
    <div className="mb-3">
      <div className="flex justify-between mb-2">
        <span className="text-xs text-slate-400">Progress</span>
        <span className="text-xs font-bold text-blue-400">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-white bg-opacity-10 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  </div>
);

const TaskItem = ({ title, dueDate, status }) => (
  <div className={`flex items-center gap-4 p-4 rounded-2xl border transition ${status === 'completed' ? 'bg-green-500/10 border-green-500/20' : 'bg-white bg-opacity-5 border-white border-opacity-10'}`}>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${status === 'completed' ? 'bg-green-500 border-green-500' : 'border-slate-400'}`}>
      {status === 'completed' && <FiCheckCircle size={16} className="text-white" />}
    </div>
    <div className="flex-1">
      <p className={`font-medium ${status === 'completed' ? 'line-through text-slate-500' : 'text-white'}`}>{title}</p>
      <p className="text-xs text-slate-500">Due: {dueDate}</p>
    </div>
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
      {status === 'completed' ? '✓ Done' : 'Pending'}
    </span>
  </div>
);

const NotificationItem = ({ type, title, message, time }) => (
  <div className={`p-4 rounded-2xl border ${type === 'success' ? 'bg-green-500/10 border-green-500/20' : type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-blue-500/10 border-blue-500/20'}`}>
    <div className="flex justify-between items-start mb-2">
      <p className="font-semibold text-white">{title}</p>
      <span className="text-xs text-slate-500">{time}</span>
    </div>
    <p className="text-sm text-slate-300">{message}</p>
  </div>
);

const ProfileField = ({ label, value, icon, subtitle }) => (
  <div className="space-y-2">
    <label className="text-sm text-slate-400 font-semibold flex items-center gap-2">
      {icon && <span className="text-lg">{icon}</span>}
      {label}
    </label>
    <div className="px-4 py-3 rounded-lg bg-white bg-opacity-5 border border-white border-opacity-10 text-white font-medium">
      {value}
    </div>
    {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
  </div>
);

const SettingToggle = ({ label, enabled }) => (
  <div className="flex justify-between items-center p-4 rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-10 hover:bg-opacity-10 transition cursor-pointer">
    <span className="text-white">{label}</span>
    <div className={`w-12 h-6 rounded-full transition ${enabled ? 'bg-blue-500' : 'bg-slate-600'} flex items-center ${enabled ? 'justify-end' : 'justify-start'} p-1`}>
      <div className="w-4 h-4 bg-white rounded-full"></div>
    </div>
  </div>
);

export default UserDashboard;
