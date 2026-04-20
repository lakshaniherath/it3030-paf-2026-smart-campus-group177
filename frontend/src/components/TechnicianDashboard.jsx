import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiTool,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiLogOut,
  FiBell,
  FiCalendar,
  FiActivity
} from 'react-icons/fi';

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [workOrders] = useState([
    { id: 'WO-1042', title: 'AC not cooling - Block B', priority: 'High', status: 'In Progress', due: 'Today 4:00 PM' },
    { id: 'WO-1045', title: 'Projector setup - Hall 03', priority: 'Medium', status: 'Pending', due: 'Tomorrow 9:00 AM' },
    { id: 'WO-1038', title: 'Water leak inspection - Lab 2', priority: 'Low', status: 'Completed', due: 'Completed' }
  ]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }

    try {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'TECHNICIAN') {
        navigate('/dashboard');
        return;
      }

      setUser(userData);
      setLoading(false);
    } catch (error) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Access Denied</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <header className="mb-8 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Technician Dashboard
          </h1>
          <p className="text-slate-400 mt-2">Welcome back, {user.name}. Here is your maintenance workload.</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-3 rounded-xl bg-white bg-opacity-5 border border-white border-opacity-10 hover:bg-opacity-10 transition">
            <FiBell />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-3 rounded-xl bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-30 border border-red-400 border-opacity-30 transition flex items-center gap-2"
          >
            <FiLogOut />
            Logout
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<FiTool />} label="Open Work Orders" value="14" accent="from-cyan-500 to-blue-500" />
        <StatCard icon={<FiClock />} label="Pending" value="6" accent="from-amber-500 to-orange-500" />
        <StatCard icon={<FiCheckCircle />} label="Completed Today" value="8" accent="from-emerald-500 to-green-500" />
        <StatCard icon={<FiAlertCircle />} label="Urgent" value="2" accent="from-rose-500 to-red-500" />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 rounded-2xl border border-white border-opacity-10 bg-white bg-opacity-5 p-6">
          <h2 className="text-xl font-semibold mb-4">Assigned Work Orders</h2>
          <div className="space-y-3">
            {workOrders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl p-4 border border-white border-opacity-10 bg-slate-900 bg-opacity-60 flex flex-wrap gap-3 items-center justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-100">{order.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{order.id} • Due: {order.due}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Badge type="priority" value={order.priority} />
                  <Badge type="status" value={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white border-opacity-10 bg-white bg-opacity-5 p-6">
          <h2 className="text-xl font-semibold mb-4">Today Overview</h2>
          <div className="space-y-4">
            <TimelineItem icon={<FiCalendar />} title="9:30 AM" text="Electrical check - Building A" />
            <TimelineItem icon={<FiActivity />} title="11:00 AM" text="Network rack maintenance" />
            <TimelineItem icon={<FiTool />} title="2:00 PM" text="Lab ventilation service" />
            <TimelineItem icon={<FiCheckCircle />} title="4:30 PM" text="Submit daily report" />
          </div>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, accent }) => (
  <div className={`rounded-2xl bg-gradient-to-br ${accent} p-[1px]`}>
    <div className="rounded-2xl bg-slate-900 p-4 h-full">
      <div className="flex items-center justify-between mb-2 text-slate-300">
        <span>{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

const Badge = ({ type, value }) => {
  let className = 'px-3 py-1 rounded-full text-xs font-medium border ';

  if (type === 'priority') {
    if (value === 'High') className += 'text-rose-300 border-rose-400/40 bg-rose-500/10';
    else if (value === 'Medium') className += 'text-amber-300 border-amber-400/40 bg-amber-500/10';
    else className += 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10';
  } else {
    if (value === 'Completed') className += 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10';
    else if (value === 'In Progress') className += 'text-cyan-300 border-cyan-400/40 bg-cyan-500/10';
    else className += 'text-slate-300 border-slate-400/40 bg-slate-500/10';
  }

  return <span className={className}>{value}</span>;
};

const TimelineItem = ({ icon, title, text }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900 bg-opacity-60 border border-white border-opacity-10">
    <div className="text-cyan-400 mt-0.5">{icon}</div>
    <div>
      <p className="font-semibold text-sm">{title}</p>
      <p className="text-xs text-slate-400 mt-1">{text}</p>
    </div>
  </div>
);

export default TechnicianDashboard;
