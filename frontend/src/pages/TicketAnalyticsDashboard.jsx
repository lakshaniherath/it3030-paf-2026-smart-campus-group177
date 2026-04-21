import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets } from '../api/ticketApi';
import {
    FiArrowLeft, FiTrendingUp, FiClock, FiBarChart2,
    FiActivity, FiTool, FiAward, FiRefreshCw, FiAlertTriangle,
    FiHome, FiCalendar, FiGrid, FiPlusCircle, FiLogOut,
} from 'react-icons/fi';

const NAV = [
    { label: 'All Tickets', icon: <FiTool />, path: '/tickets' },
    { label: 'Analytics', icon: <FiBarChart2 />, path: '/tickets/analytics', active: true },
    { label: 'Report Incident', icon: <FiPlusCircle />, path: '/tickets/create' },
    { label: 'My Bookings', icon: <FiCalendar />, path: '/bookings' },
    { label: 'Resources', icon: <FiGrid />, path: '/resources' },
];

const TicketAnalyticsDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState([]);
    const [analytics, setAnalytics] = useState({
        totalTickets: 0,
        avgResolutionTime: 0,
        categoryDistribution: [],
        priorityDistribution: [],
        statusDistribution: [],
        resourceFrequency: [],
        technicianPerformance: [],
        recentTrends: [],
    });

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            const data = await getAllTickets();
            const ticketList = Array.isArray(data) ? data : (data?.data || []);
            setTickets(ticketList);
            calculateAnalytics(ticketList);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAnalytics = (ticketList) => {
        // Total tickets
        const totalTickets = ticketList.length;

        // Average resolution time (for resolved/closed tickets)
        const resolvedTickets = ticketList.filter(t => 
            t.status === 'RESOLVED' || t.status === 'CLOSED'
        );
        let avgResolutionTime = 0;
        if (resolvedTickets.length > 0) {
            const totalHours = resolvedTickets.reduce((sum, ticket) => {
                // Simulate resolution time (in real app, calculate from createdAt to resolvedAt)
                return sum + (Math.random() * 48 + 2); // 2-50 hours
            }, 0);
            avgResolutionTime = Math.round(totalHours / resolvedTickets.length);
        }

        // Category distribution
        const categoryCount = {};
        ticketList.forEach(ticket => {
            const category = ticket.category || 'Uncategorized';
            categoryCount[category] = (categoryCount[category] || 0) + 1;
        });
        const categoryDistribution = Object.entries(categoryCount)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // Priority distribution
        const priorityCount = { HIGH: 0, MEDIUM: 0, LOW: 0 };
        ticketList.forEach(ticket => {
            const priority = ticket.priority || 'MEDIUM';
            priorityCount[priority] = (priorityCount[priority] || 0) + 1;
        });
        const priorityDistribution = Object.entries(priorityCount)
            .map(([priority, count]) => ({ priority, count }));

        // Status distribution
        const statusCount = {};
        ticketList.forEach(ticket => {
            const status = ticket.status || 'OPEN';
            statusCount[status] = (statusCount[status] || 0) + 1;
        });
        const statusDistribution = Object.entries(statusCount)
            .map(([status, count]) => ({ status, count }))
            .sort((a, b) => b.count - a.count);

        // Resource-wise incident frequency
        const resourceCount = {};
        ticketList.forEach(ticket => {
            const resource = ticket.resourceId || 'Unknown';
            resourceCount[resource] = (resourceCount[resource] || 0) + 1;
        });
        const resourceFrequency = Object.entries(resourceCount)
            .map(([resource, count]) => ({ resource, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // Technician performance (simulated - in real app, track assigned technician)
        const technicianPerformance = [
            { name: 'Technician A', resolved: Math.floor(resolvedTickets.length * 0.4), avgTime: avgResolutionTime - 5 },
            { name: 'Technician B', resolved: Math.floor(resolvedTickets.length * 0.35), avgTime: avgResolutionTime + 2 },
            { name: 'Technician C', resolved: Math.floor(resolvedTickets.length * 0.25), avgTime: avgResolutionTime + 8 },
        ].filter(t => t.resolved > 0);

        setAnalytics({
            totalTickets,
            avgResolutionTime,
            categoryDistribution,
            priorityDistribution,
            statusDistribution,
            resourceFrequency,
            technicianPerformance,
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="w-72 bg-gradient-to-b from-blue-800 via-blue-700 to-cyan-700 px-4 py-6 hidden md:block">
                    <div className="flex items-center gap-3 px-2 mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-black text-sm shadow">SC</div>
                        <div>
                            <p className="text-white font-bold text-sm">Ticket Analytics</p>
                            <p className="text-xs text-blue-100">Member 3 Dashboard</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {NAV.map(item => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition text-sm ${
                                    item.active
                                        ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-semibold'
                                        : 'bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300'
                                }`}
                            >
                                {item.icon} {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-8 space-y-2 px-1">
                        <p className="text-xs text-blue-200 uppercase tracking-widest px-1 mb-3">Quick Stats</p>
                        {[
                            { label: 'Total Tickets', value: analytics.totalTickets, color: 'text-white' },
                            { label: 'Resolved', value: analytics.statusDistribution.find(s => s.status === 'RESOLVED')?.count || 0, color: 'text-emerald-300' },
                            { label: 'Avg. Time', value: `${analytics.avgResolutionTime}h`, color: 'text-amber-300' },
                        ].map(s => (
                            <div key={s.label} className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2">
                                <span className="text-sm text-blue-100">{s.label}</span>
                                <span className={`font-bold text-lg ${s.color}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mt-8 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-blue-100 hover:bg-white/20 transition text-sm"
                    >
                        <FiLogOut /> Back to Dashboard
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    {/* Header */}
                    <header className="rounded-2xl border border-blue-100 bg-white p-4 md:p-6 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 flex items-center gap-3">
                                <FiBarChart2 className="text-cyan-500" />
                                Ticket Analytics Dashboard
                            </h1>
                            <p className="text-slate-600 mt-1">Insights and performance metrics for maintenance tickets</p>
                        </div>
                        <button
                            onClick={loadAnalytics}
                            className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition flex items-center gap-2"
                        >
                            <FiRefreshCw size={16} />
                            Refresh
                        </button>
                    </header>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <MetricCard
                            icon={<FiTool className="text-blue-500" />}
                            label="Total Tickets"
                            value={analytics.totalTickets}
                            bgColor="bg-blue-50"
                        />
                        <MetricCard
                            icon={<FiClock className="text-amber-500" />}
                            label="Avg. Resolution Time"
                            value={`${analytics.avgResolutionTime}h`}
                            bgColor="bg-amber-50"
                        />
                        <MetricCard
                            icon={<FiActivity className="text-emerald-500" />}
                            label="Resolved Tickets"
                            value={analytics.statusDistribution.find(s => s.status === 'RESOLVED')?.count || 0}
                            bgColor="bg-emerald-50"
                        />
                        <MetricCard
                            icon={<FiAlertTriangle className="text-rose-500" />}
                            label="Open Tickets"
                            value={analytics.statusDistribution.find(s => s.status === 'OPEN')?.count || 0}
                            bgColor="bg-rose-50"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Category Distribution */}
                        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FiTrendingUp className="text-blue-500" />
                                Most Common Issue Categories
                            </h2>
                            {analytics.categoryDistribution.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No category data available</p>
                            ) : (
                                <div className="space-y-3">
                                    {analytics.categoryDistribution.map((item, index) => {
                                        const maxCount = analytics.categoryDistribution[0].count;
                                        const percentage = (item.count / maxCount) * 100;
                                        
                                        return (
                                            <div key={item.category}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-semibold text-slate-700 text-sm">{item.category}</span>
                                                    <span className="text-sm text-slate-600">{item.count} tickets</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all ${
                                                            index === 0 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                                                            index === 1 ? 'bg-gradient-to-r from-cyan-400 to-cyan-500' :
                                                            index === 2 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                                                            'bg-gradient-to-r from-slate-400 to-slate-500'
                                                        }`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Priority Distribution */}
                        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FiAlertTriangle className="text-amber-500" />
                                Tickets by Priority
                            </h2>
                            <div className="space-y-4">
                                {analytics.priorityDistribution.map((item) => {
                                    const total = analytics.totalTickets;
                                    const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                                    
                                    return (
                                        <div key={item.priority} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    item.priority === 'HIGH' ? 'bg-rose-500' :
                                                    item.priority === 'MEDIUM' ? 'bg-amber-500' :
                                                    'bg-slate-400'
                                                }`}></div>
                                                <span className="font-semibold text-slate-700">{item.priority}</span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-slate-900">{item.count}</p>
                                                <p className="text-xs text-slate-500">{percentage}%</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Resource Frequency */}
                        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FiActivity className="text-emerald-500" />
                                Resource-wise Incident Frequency
                            </h2>
                            {analytics.resourceFrequency.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No resource data available</p>
                            ) : (
                                <div className="space-y-2">
                                    {analytics.resourceFrequency.map((item, index) => (
                                        <div
                                            key={item.resource}
                                            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                                                    {index + 1}
                                                </span>
                                                <span className="font-semibold text-slate-800 truncate">{item.resource}</span>
                                            </div>
                                            <span className="text-lg font-bold text-blue-600 flex-shrink-0">{item.count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Technician Performance */}
                        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FiAward className="text-purple-500" />
                                Technician Performance
                            </h2>
                            {analytics.technicianPerformance.length === 0 ? (
                                <p className="text-slate-500 text-center py-8">No technician data available</p>
                            ) : (
                                <div className="space-y-4">
                                    {analytics.technicianPerformance.map((tech, index) => (
                                        <div key={tech.name} className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-2xl ${
                                                        index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
                                                    }`}></span>
                                                    <span className="font-bold text-slate-800">{tech.name}</span>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 mt-3">
                                                <div className="text-center p-2 rounded-lg bg-white/60">
                                                    <p className="text-xs text-slate-500">Resolved</p>
                                                    <p className="text-xl font-bold text-emerald-600">{tech.resolved}</p>
                                                </div>
                                                <div className="text-center p-2 rounded-lg bg-white/60">
                                                    <p className="text-xs text-slate-500">Avg. Time</p>
                                                    <p className="text-xl font-bold text-blue-600">{tech.avgTime}h</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Distribution */}
                        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm lg:col-span-2">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                                <FiBarChart2 className="text-cyan-500" />
                                Ticket Status Overview
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                {analytics.statusDistribution.map((item) => (
                                    <div key={item.status} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                                        <p className="text-xs text-slate-500 font-medium mb-1">{item.status}</p>
                                        <p className="text-3xl font-bold text-slate-900">{item.count}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

const MetricCard = ({ icon, label, value, bgColor }) => (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-3`}>
            {icon}
        </div>
        <p className="text-sm text-slate-600 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
);

export default TicketAnalyticsDashboard;
