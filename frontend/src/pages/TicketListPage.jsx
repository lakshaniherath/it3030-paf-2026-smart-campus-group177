import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets, deleteTicket, updateTicketStatus } from '../api/ticketApi';
import {
    FiPlusCircle, FiRefreshCw, FiSearch, FiTrash2,
    FiEye, FiTool, FiAlertCircle, FiCheckCircle,
    FiClock, FiArrowLeft, FiHome, FiCalendar, FiGrid, FiLogOut, FiBarChart2,
} from 'react-icons/fi';

const NAV = [
    { label: 'All Tickets',     icon: <FiTool />,     path: '/tickets',        active: true },
    { label: 'Analytics',       icon: <FiBarChart2 />, path: '/tickets/analytics' },
    { label: 'Report Incident', icon: <FiPlusCircle />, path: '/tickets/create' },
    { label: 'My Bookings',     icon: <FiCalendar />, path: '/bookings' },
    { label: 'Resources',       icon: <FiGrid />,     path: '/resources' },
    { label: 'Dashboard',       icon: <FiHome />,     path: '/dashboard' },
];

const STATUS_STYLES = {
    OPEN:        'bg-blue-100 text-blue-700 border-blue-200',
    IN_PROGRESS: 'bg-amber-100 text-amber-700 border-amber-200',
    RESOLVED:    'bg-emerald-100 text-emerald-700 border-emerald-200',
    CLOSED:      'bg-slate-100 text-slate-600 border-slate-200',
    REJECTED:    'bg-rose-100 text-rose-700 border-rose-200',
};

const PRIORITY_STYLES = {
    LOW:    'bg-slate-100 text-slate-600 border-slate-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    HIGH:   'bg-rose-100 text-rose-700 border-rose-200',
};

const TicketListPage = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Get user from localStorage (consistent with rest of the app)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Check if user has permission to update status (only ADMIN or TECHNICIAN)
    const canUpdateStatus = user?.role === 'ADMIN' || user?.role === 'TECHNICIAN';

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllTickets();
            const raw = Array.isArray(data) ? data : (data?.data || []);
            setTickets(raw.map(t => ({ ...t, id: t.id || t._id })));
        } catch {
            setError('Could not load tickets. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTickets(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this ticket?')) return;
        try {
            await deleteTicket(id);
            setTickets(tickets.filter(t => t.id !== id));
        } catch {
            setError('Failed to delete ticket.');
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateTicketStatus(id, newStatus);
            fetchTickets();
        } catch {
            setError('Failed to update status.');
        }
    };

    const filtered = tickets.filter(t =>
        t.resourceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'OPEN').length,
        inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-blue-800 via-blue-700 to-cyan-700 px-4 py-6 hidden md:flex flex-col flex-shrink-0">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-black text-sm shadow flex-shrink-0">SC</div>
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">Maintenance</p>
                    </div>
                </div>
                <nav className="space-y-2 flex-1">
                    {NAV.map(item => (
                        <button key={item.path} onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition text-sm ${
                                item.active
                                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-semibold'
                                    : 'bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300'
                            }`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
                <button onClick={() => navigate('/dashboard')}
                    className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-blue-100 hover:bg-white/20 transition text-sm">
                    <FiLogOut /> Back to Dashboard
                </button>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/dashboard')}
                            className="flex items-center justify-center h-9 w-9 rounded-xl border border-blue-100 bg-blue-50 text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition">
                            <FiArrowLeft size={16} />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-blue-900">Maintenance Tickets</h1>
                            <p className="text-xs text-slate-500">Track and manage campus incident reports</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {canUpdateStatus && (
                            <button
                                onClick={() => navigate('/tickets/analytics')}
                                className="px-3 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 transition flex items-center gap-2 text-sm"
                            >
                                <FiBarChart2 size={14} /> Analytics
                            </button>
                        )}
                        <button onClick={fetchTickets}
                            className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition flex items-center gap-2 text-slate-700 text-sm">
                            <FiRefreshCw size={14} /> Refresh
                        </button>
                        <button onClick={() => navigate('/tickets/create')}
                            className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 transition flex items-center gap-2 text-sm">
                            <FiPlusCircle size={14} /> New Ticket
                        </button>
                    </div>
                </div>
            </header>

            <div className="px-4 md:px-8 py-8 space-y-6">
                {error && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">{error}</div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total', value: stats.total, icon: <FiTool className="text-blue-500" />, bg: 'bg-blue-50' },
                        { label: 'Open', value: stats.open, icon: <FiAlertCircle className="text-blue-600" />, bg: 'bg-blue-50' },
                        { label: 'In Progress', value: stats.inProgress, icon: <FiClock className="text-amber-500" />, bg: 'bg-amber-50' },
                        { label: 'Resolved', value: stats.resolved, icon: <FiCheckCircle className="text-emerald-500" />, bg: 'bg-emerald-50' },
                    ].map(s => (
                        <div key={s.label} className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm flex items-center gap-3">
                            <div className={`h-10 w-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                                {s.icon}
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">{s.label}</p>
                                <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="rounded-2xl border border-blue-100 bg-white p-3 shadow-sm">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                        <input type="text" placeholder="Search by location or description..."
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-blue-100 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                            value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>

                {/* Ticket list */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[1,2,3].map(i => (
                            <div key={i} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm animate-pulse space-y-3">
                                <div className="h-4 w-20 bg-blue-50 rounded-lg" />
                                <div className="h-5 w-3/4 bg-blue-50 rounded-lg" />
                                <div className="h-3.5 w-1/2 bg-blue-50 rounded-lg" />
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-blue-100 bg-white p-16 text-center shadow-sm">
                        <FiTool className="mx-auto mb-3 text-slate-300" size={36} />
                        <p className="font-semibold text-slate-700">No tickets found</p>
                        <p className="text-slate-400 text-sm mt-1">Try adjusting your search or create a new ticket.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filtered.map(ticket => (
                            <div key={ticket.id} className="rounded-2xl border border-blue-100 bg-white shadow-sm hover:shadow-md transition flex flex-col">
                                <div className="p-5 flex-1 space-y-3">
                                    {/* Status + Priority */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN}`}>
                                            {ticket.status}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.MEDIUM}`}>
                                            {ticket.priority}
                                        </span>
                                        <span className="ml-auto text-xs font-mono text-slate-400">#{String(ticket.id).slice(-5)}</span>
                                    </div>

                                    {/* Description */}
                                    <p className="font-semibold text-slate-800 line-clamp-2 text-sm">{ticket.description}</p>

                                    {/* Meta */}
                                    <div className="text-xs text-slate-500 space-y-1">
                                        <p>📍 {ticket.resourceId}</p>
                                        <p>👤 {ticket.reportedBy || 'Unknown'}</p>
                                        {ticket.category && <p>🏷 {ticket.category}</p>}
                                    </div>

                                    {/* Images */}
                                    {ticket.imageUrls?.length > 0 && (
                                        <div className="flex gap-2 flex-wrap">
                                            {ticket.imageUrls.map((url, i) => (
                                                <img key={i} src={url} alt="evidence"
                                                    className="w-16 h-16 object-cover rounded-xl border border-blue-100 cursor-pointer hover:scale-105 transition"
                                                    onClick={() => window.open(url, '_blank')}
                                                    onError={e => { e.target.src = 'https://via.placeholder.com/64?text=Img'; }} />
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="border-t border-blue-50 p-4 space-y-3">
                                    {canUpdateStatus && (
                                        <div>
                                            <label className="block text-xs text-slate-500 font-medium mb-1">Update Status</label>
                                            <select
                                                className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                value={ticket.status}
                                                onChange={e => handleStatusChange(ticket.id, e.target.value)}
                                            >
                                                <option value="OPEN">OPEN</option>
                                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                                <option value="RESOLVED">RESOLVED</option>
                                                <option value="CLOSED">CLOSED</option>
                                                <option value="REJECTED">REJECTED</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <button onClick={() => navigate(`/tickets/${ticket.id}`)}
                                            className="flex-1 py-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition flex items-center justify-center gap-1.5">
                                            <FiEye size={13} /> Details
                                        </button>
                                        <button onClick={() => handleDelete(ticket.id)}
                                            className="p-2 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default TicketListPage;
