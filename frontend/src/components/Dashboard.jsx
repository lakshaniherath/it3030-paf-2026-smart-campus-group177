import React from 'react';
import { FiHome, FiBell, FiUser, FiLogOut, FiSettings, FiGrid } from 'react-icons/fi';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] flex text-white font-sans">
      
      {/* Sidebar - Glassmorphism Effect */}
      <aside className="w-64 bg-white bg-opacity-5 backdrop-blur-md border-r border-white border-opacity-10 p-6 flex flex-col justify-between">
        <div>
          <div className="mb-10 px-2">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Smart Campus
            </h1>
          </div>
          
          <nav className="space-y-4">
            <NavItem icon={<FiHome />} label="Home" active />
            <NavItem icon={<FiGrid />} label="Projects" />
            <NavItem icon={<FiBell />} label="Notifications" />
            <NavItem icon={<FiUser />} label="Profile" />
            <NavItem icon={<FiSettings />} label="Settings" />
          </nav>
        </div>

        <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500 hover:bg-opacity-10 rounded-xl transition">
          <FiLogOut /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-semibold">Welcome back, Lakshani!</h2>
            <p className="text-slate-400">Here's what's happening in your campus hub.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative p-2 bg-white bg-opacity-5 rounded-full border border-white border-opacity-10 cursor-pointer">
              <FiBell size={20} />
              <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#0f172a]"></span>
            </div>
            <img 
              src="https://ui-avatars.com/api/?name=Lakshani&background=0D8ABC&color=fff" 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-blue-500 p-0.5"
            />
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Projects" value="12" color="from-blue-500 to-cyan-500" />
          <StatCard title="Unread Alerts" value="05" color="from-purple-500 to-pink-500" />
          <StatCard title="Active Tasks" value="08" color="from-emerald-500 to-teal-500" />
        </div>

        {/* Content Section */}
        <div className="bg-white bg-opacity-5 rounded-3xl border border-white border-opacity-10 p-8">
          <h3 className="text-xl font-medium mb-6">Recent Activity</h3>
          <div className="space-y-4">
            <ActivityItem text="User Management module updated by Member 4" time="2 hours ago" />
            <ActivityItem text="New notification from IT3030 module" time="5 hours ago" />
            <ActivityItem text="System architecture finalized" time="Yesterday" />
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper Components
const NavItem = ({ icon, label, active = false }) => (
  <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-white hover:bg-opacity-5 hover:text-white'}`}>
    <span className="text-xl">{icon}</span>
    <span className="font-medium">{label}</span>
  </div>
);

const StatCard = ({ title, value, color }) => (
  <div className={`p-6 rounded-3xl bg-gradient-to-br ${color} shadow-lg`}>
    <p className="text-white text-opacity-80 text-sm mb-1">{title}</p>
    <h4 className="text-3xl font-bold text-white">{value}</h4>
  </div>
);

const ActivityItem = ({ text, time }) => (
  <div className="flex justify-between items-center p-4 rounded-2xl bg-white bg-opacity-5 border border-white border-opacity-5">
    <span className="text-slate-300">{text}</span>
    <span className="text-sm text-slate-500">{time}</span>
  </div>
);

export default Dashboard;