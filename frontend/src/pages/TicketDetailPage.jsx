import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllTickets } from '../api/ticketApi';
import TicketStatusStepper from '../components/TicketStatusStepper';
import {
    FiArrowLeft, FiMapPin, FiUser, FiPhone, FiTag, FiAlertTriangle,
    FiHome, FiCalendar, FiGrid, FiTool, FiLogOut, FiPlusCircle,
} from 'react-icons/fi';

const NAV = [
    { label: 'All Tickets',     icon: <FiTool />,       path: '/tickets', active: true },
    { label: 'Report Incident', icon: <FiPlusCircle />,  path: '/tickets/create' },
    { label: 'My Bookings',     icon: <FiCalendar />,   path: '/bookings' },
    { label: 'Resources',       icon: <FiGrid />,       path: '/resources' },
    { label: 'Dashboard',       icon: <FiHome />,       path: '/dashboard' },
];

const PRIORITY_STYLES = {
    LOW:    'bg-slate-100 text-slate-600 border-slate-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    HIGH:   'bg-rose-100 text-rose-700 border-rose-200',
};

export default function TicketDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        getAllTickets()
            .then(res => {
                if (!mounted) return;
                const list = Array.isArray(res) ? res : (res?.data || []);
                const found = list.find(t => String(t.id) === String(id));
                found ? setTicket(found) : setError(`Ticket #${id} not found.`);
            })
            .catch(() => setError('Failed to load ticket details.'))
            .finally(() => { if (mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Loading ticket...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                    <p className="text-rose-600 font-semibold mb-4">{error}</p>
                    <button onClick={() => navigate('/tickets')}
                        className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-slate-700 hover:bg-blue-100 transition text-sm">
                        Back to Tickets
                    </button>
                </div>
            </div>
        );
    }

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
                <div className="px-4 md:px-8 py-4 flex items-center gap-3">
                    <button onClick={() => navigate('/tickets')}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700 transition">
                        <FiArrowLeft size={15} /> Back to Tickets
                    </button>
                </div>
            </header>

            <div className="px-4 md:px-8 py-8 space-y-5 max-w-3xl">
                {/* Title row */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold text-blue-900">Ticket Details</h1>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">#{ticket.id}</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.MEDIUM}`}>
                            <FiAlertTriangle className="inline mr-1" size={11} />{ticket.priority}
                        </span>
                    </div>
                </div>

                {/* Status stepper */}
                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 mb-4">Ticket Progress</h3>
                    <TicketStatusStepper currentStatus={ticket.status || 'OPEN'} />
                </div>

                {/* Details */}
                <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 border-b border-blue-50 pb-2">Incident Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-start gap-2">
                            <FiMapPin className="text-blue-400 mt-0.5 flex-shrink-0" size={14} />
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Resource / Location</p>
                                <p className="font-semibold text-slate-800">{ticket.resourceId}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <FiTag className="text-blue-400 mt-0.5 flex-shrink-0" size={14} />
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Category</p>
                                <p className="font-semibold text-slate-800">{ticket.category || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <FiUser className="text-blue-400 mt-0.5 flex-shrink-0" size={14} />
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Reported By</p>
                                <p className="font-semibold text-slate-800">{ticket.reportedBy || '—'}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <FiPhone className="text-blue-400 mt-0.5 flex-shrink-0" size={14} />
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Contact</p>
                                <p className="font-semibold text-slate-800">{ticket.contactDetails || '—'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Description</p>
                        <p className="text-slate-700 text-sm leading-relaxed">{ticket.description}</p>
                    </div>

                    {ticket.resolutionNote && (
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                            <p className="text-xs text-emerald-600 font-medium uppercase tracking-wide mb-1">Resolution Note</p>
                            <p className="text-slate-700 text-sm leading-relaxed">{ticket.resolutionNote}</p>
                        </div>
                    )}
                </div>

                {/* Evidence images */}
                {ticket.imageUrls?.length > 0 && (
                    <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                        <h3 className="text-sm font-semibold text-slate-700 mb-4">Evidence Images</h3>
                        <div className="flex flex-wrap gap-3">
                            {ticket.imageUrls.map((url, i) => (
                                <img key={i} src={url} alt={`evidence-${i}`}
                                    className="w-24 h-24 object-cover rounded-xl border border-blue-100 cursor-pointer hover:scale-105 transition shadow-sm"
                                    onClick={() => window.open(url, '_blank')}
                                    onError={e => { e.target.src = 'https://via.placeholder.com/96?text=Img'; }} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
}
