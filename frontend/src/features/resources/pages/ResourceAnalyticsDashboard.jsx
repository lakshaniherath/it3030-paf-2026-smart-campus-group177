import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    FiArrowLeft, FiTrendingUp, FiClock, FiBarChart2,
    FiActivity, FiCalendar, FiAward, FiRefreshCw, FiDatabase
} from 'react-icons/fi';

const ResourceAnalyticsDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [analytics, setAnalytics] = useState({
        mostPopular: [],
        averageDuration: 0,
        utilizationRate: 0,
        peakHours: [],
        totalBookings: 0,
        activeResources: 0
    });

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        setLoading(true);
        try {
            // Fetch resources
            const resourceRes = await axios.get('http://localhost:8080/api/resources?size=100');
            const resourceList = resourceRes.data?.content || [];
            setResources(resourceList);

            // Fetch all bookings
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const bookingRes = await axios.get('http://localhost:8080/api/member2/bookings', {
                headers: { 'X-User-Email': user.email || '' }
            });
            const bookingList = bookingRes.data || [];
            setBookings(bookingList);

            // Calculate analytics
            calculateAnalytics(resourceList, bookingList);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateAnalytics = (resourceList, bookingList) => {
        // Filter approved bookings only
        const approvedBookings = bookingList.filter(b => b.status === 'APPROVED' || b.status === 'PENDING');

        // 1. Most Popular Resources
        const resourceBookingCount = {};
        approvedBookings.forEach(booking => {
            resourceBookingCount[booking.resourceId] = (resourceBookingCount[booking.resourceId] || 0) + 1;
        });

        const mostPopular = Object.entries(resourceBookingCount)
            .map(([resourceId, count]) => {
                const resource = resourceList.find(r => r.id === resourceId);
                return {
                    resourceId,
                    name: resource?.name || resourceId,
                    count,
                    type: resource?.type || 'Unknown'
                };
            })
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        // 2. Average Booking Duration
        let totalMinutes = 0;
        approvedBookings.forEach(booking => {
            const start = parseTime(booking.startTime);
            const end = parseTime(booking.endTime);
            totalMinutes += end - start;
        });
        const averageDuration = approvedBookings.length > 0 
            ? Math.round(totalMinutes / approvedBookings.length) 
            : 0;

        // 3. Utilization Rate (simplified - based on bookings vs available resources)
        const activeResources = resourceList.filter(r => r.status === 'ACTIVE').length;
        const utilizationRate = activeResources > 0 
            ? Math.round((approvedBookings.length / (activeResources * 30)) * 100) // Rough estimate
            : 0;

        // 4. Peak Usage Hours
        const hourCounts = {};
        approvedBookings.forEach(booking => {
            const hour = parseInt(booking.startTime.split(':')[0]);
            hourCounts[hour] = (hourCounts[hour] || 0) + 1;
        });

        const peakHours = Object.entries(hourCounts)
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        setAnalytics({
            mostPopular,
            averageDuration,
            utilizationRate: Math.min(utilizationRate, 100),
            peakHours,
            totalBookings: approvedBookings.length,
            activeResources
        });
    };

    const parseTime = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };

    const getUtilizationColor = (rate) => {
        if (rate >= 80) return 'text-rose-600 bg-rose-50 border-rose-200';
        if (rate >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
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
                    <h2 className="text-xl font-bold text-white px-2">Resource Analytics</h2>
                    <nav className="mt-8 space-y-2">
                        <button
                            onClick={() => navigate('/admin/resources')}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300 transition"
                        >
                            <FiArrowLeft /> Back to Management
                        </button>
                    </nav>
                    <div className="mt-8 space-y-2 px-1">
                        <p className="text-xs text-blue-200 uppercase tracking-widest px-1 mb-3">Quick Stats</p>
                        {[
                            { label: "Total Bookings", value: analytics.totalBookings, color: "text-white" },
                            { label: "Active Resources", value: analytics.activeResources, color: "text-emerald-300" },
                            { label: "Utilization", value: `${analytics.utilizationRate}%`, color: "text-amber-300" },
                        ].map(s => (
                            <div key={s.label} className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2">
                                <span className="text-sm text-blue-100">{s.label}</span>
                                <span className={`font-bold text-lg ${s.color}`}>{s.value}</span>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4 md:p-8">
                    {/* Header */}
                    <header className="rounded-2xl border border-blue-100 bg-white p-4 md:p-6 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 flex items-center gap-3">
                                <FiBarChart2 className="text-cyan-500" />
                                Resource Usage Analytics
                            </h1>
                            <p className="text-slate-600 mt-1">Insights and statistics for resource management</p>
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
                        icon={<FiCalendar className="text-blue-500" />}
                        label="Total Bookings"
                        value={analytics.totalBookings}
                        bgColor="bg-blue-50"
                    />
                    <MetricCard
                        icon={<FiDatabase className="text-emerald-500" />}
                        label="Active Resources"
                        value={analytics.activeResources}
                        bgColor="bg-emerald-50"
                    />
                    <MetricCard
                        icon={<FiClock className="text-amber-500" />}
                        label="Avg. Duration"
                        value={formatDuration(analytics.averageDuration)}
                        bgColor="bg-amber-50"
                    />
                    <MetricCard
                        icon={<FiActivity className="text-rose-500" />}
                        label="Utilization Rate"
                        value={`${analytics.utilizationRate}%`}
                        bgColor="bg-rose-50"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Most Popular Resources */}
                    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FiAward className="text-amber-500" />
                            Most Popular Resources
                        </h2>
                        {analytics.mostPopular.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No booking data available</p>
                        ) : (
                            <div className="space-y-3">
                                {analytics.mostPopular.map((item, index) => (
                                    <div
                                        key={item.resourceId}
                                        className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100"
                                    >
                                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                                            index === 0 ? 'bg-amber-400 text-slate-900' :
                                            index === 1 ? 'bg-slate-300 text-slate-700' :
                                            index === 2 ? 'bg-orange-300 text-slate-700' :
                                            'bg-blue-200 text-slate-700'
                                        }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-800 truncate">{item.name}</p>
                                            <p className="text-xs text-slate-500">{item.type?.replace(/_/g, ' ')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-blue-600">{item.count}</p>
                                            <p className="text-xs text-slate-500">bookings</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Peak Usage Hours */}
                    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FiTrendingUp className="text-emerald-500" />
                            Peak Usage Hours
                        </h2>
                        {analytics.peakHours.length === 0 ? (
                            <p className="text-slate-500 text-center py-8">No booking data available</p>
                        ) : (
                            <div className="space-y-4">
                                {analytics.peakHours.map((item, index) => {
                                    const maxCount = analytics.peakHours[0].count;
                                    const percentage = (item.count / maxCount) * 100;
                                    
                                    return (
                                        <div key={item.hour}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-semibold text-slate-700">
                                                    {item.hour.toString().padStart(2, '0')}:00 - {(item.hour + 1).toString().padStart(2, '0')}:00
                                                </span>
                                                <span className="text-sm text-slate-600">{item.count} bookings</span>
                                            </div>
                                            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${
                                                        index === 0 ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
                                                        index === 1 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                                                        'bg-gradient-to-r from-cyan-400 to-cyan-500'
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

                    {/* Utilization Breakdown */}
                    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FiActivity className="text-blue-500" />
                            Utilization Overview
                        </h2>
                        <div className="space-y-4">
                            <div className="text-center py-6">
                                <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-8 ${getUtilizationColor(analytics.utilizationRate)}`}>
                                    <div>
                                        <p className="text-4xl font-bold">{analytics.utilizationRate}%</p>
                                        <p className="text-xs font-medium mt-1">Utilized</p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <p className="text-xs text-emerald-600 font-medium">Booked</p>
                                    <p className="text-2xl font-bold text-emerald-700">{analytics.totalBookings}</p>
                                </div>
                                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                                    <p className="text-xs text-blue-600 font-medium">Resources</p>
                                    <p className="text-2xl font-bold text-blue-700">{analytics.activeResources}</p>
                                </div>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                                <p className="text-sm text-slate-600">
                                    {analytics.utilizationRate >= 80 ? '🔴 High utilization - Consider adding more resources' :
                                     analytics.utilizationRate >= 50 ? '🟡 Moderate utilization - Resources are well used' :
                                     '🟢 Low utilization - Resources are available'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Trends */}
                    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <FiBarChart2 className="text-purple-500" />
                            Quick Stats
                        </h2>
                        <div className="space-y-3">
                            <StatRow
                                label="Average Booking Duration"
                                value={formatDuration(analytics.averageDuration)}
                                icon="⏱️"
                            />
                            <StatRow
                                label="Most Popular Time"
                                value={analytics.peakHours[0] ? `${analytics.peakHours[0].hour}:00` : 'N/A'}
                                icon="🕐"
                            />
                            <StatRow
                                label="Total Active Resources"
                                value={analytics.activeResources}
                                icon="🏢"
                            />
                            <StatRow
                                label="Total Bookings"
                                value={analytics.totalBookings}
                                icon="📅"
                            />
                            <StatRow
                                label="Avg. Bookings per Resource"
                                value={analytics.activeResources > 0 ? Math.round(analytics.totalBookings / analytics.activeResources) : 0}
                                icon="📊"
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
    );
};

const MetricCard = ({ icon, label, value, bgColor }) => (
    <div className={`rounded-2xl border border-blue-100 bg-white p-5 shadow-sm`}>
        <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center mb-3`}>
            {icon}
        </div>
        <p className="text-sm text-slate-600 font-medium">{label}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
);

const StatRow = ({ label, value, icon }) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
        <div className="flex items-center gap-2">
            <span className="text-xl">{icon}</span>
            <span className="text-sm text-slate-700">{label}</span>
        </div>
        <span className="font-bold text-slate-900">{value}</span>
    </div>
);

export default ResourceAnalyticsDashboard;
