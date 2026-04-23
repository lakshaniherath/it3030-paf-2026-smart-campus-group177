import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllTickets, deleteTicket, updateTicketStatus } from '../api/ticketApi';

const TicketListPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    
    const navigate = useNavigate();

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const data = await getAllTickets();
            const rawData = Array.isArray(data) ? data : (data.data || []);
            const normalizedData = rawData.map(t => ({
                ...t,
                id: t.id || t._id 
            }));
            setTickets(normalizedData);
        } catch (err) {
            console.error("Failed to fetch tickets:", err);
            setError("Could not load data. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this ticket?")) {
            try {
                await deleteTicket(id);
                setTickets(tickets.filter(t => t.id !== id));
            } catch (err) {
                alert("Failed to delete the ticket.");
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await updateTicketStatus(id, newStatus);
            fetchTickets();
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    const filteredTickets = tickets?.filter(ticket => 
        ticket.resourceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Stats ගණනය කිරීම
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'OPEN').length;
    const resolvedTickets = tickets.filter(t => t.status === 'RESOLVED').length;
    const inProgressTickets = tickets.filter(t => t.status === 'IN_PROGRESS').length;

    if (loading) return <div className="flex justify-center items-center h-screen text-slate-500 font-bold uppercase tracking-widest">Loading Smart Campus...</div>;

    return (
        <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-10 text-left font-sans">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Maintenance Dashboard</h1>
                        <p className="text-slate-500 font-medium mt-1">Real-time status of campus maintenance requests</p>
                    </div>
                    <button onClick={fetchTickets} className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl shadow-sm hover:bg-slate-50 text-slate-700 font-bold transition-all active:scale-95">
                        🔄 Refresh Data
                    </button>
                </div>

                {/* --- New Stats Cards Section --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total</p>
                        <p className="text-4xl font-black text-slate-900">{totalTickets}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border-l-8 border-l-indigo-500 shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Open</p>
                        <p className="text-4xl font-black text-indigo-600">{openTickets}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border-l-8 border-l-amber-500 shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">In Progress</p>
                        <p className="text-4xl font-black text-amber-600">{inProgressTickets}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] border-l-8 border-l-emerald-500 shadow-sm border border-slate-100">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Resolved</p>
                        <p className="text-4xl font-black text-emerald-600">{resolvedTickets}</p>
                    </div>
                </div>
                
                {/* Search Bar */}
                <div className="bg-white p-2 rounded-[24px] shadow-sm border border-slate-100 mb-10">
                    <input
                        type="text"
                        placeholder="Quick search by location or issue..."
                        className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all"
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredTickets.length > 0 ? (
                        filteredTickets.map((ticket) => (
                            <div key={ticket.id} className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col">
                                <div className="p-8 pb-10">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white ${
                                            ticket.status === 'REJECTED' ? 'bg-rose-500' : 
                                            ticket.status === 'RESOLVED' ? 'bg-emerald-500' : 'bg-indigo-600'
                                        }`}>
                                            {ticket.status}
                                        </div>
                                        <span className="text-slate-300 text-[11px] font-black uppercase tracking-tighter">#{String(ticket.id).slice(-5)}</span>
                                    </div>

                                    <h3 
                                        className="text-slate-900 font-black text-2xl mb-4 leading-tight"
                                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '3.5rem' }}
                                    >
                                        {ticket.description}
                                    </h3>
                                    
                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center gap-4 text-slate-600">
                                            <span className="w-10 h-10 flex items-center justify-center bg-rose-50 rounded-2xl text-rose-500 text-lg">📍</span>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Resource Location</p>
                                                <p className="font-bold text-slate-800">{ticket.resourceId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 text-slate-600">
                                            <span className="w-10 h-10 flex items-center justify-center bg-slate-100 rounded-2xl text-slate-500 text-lg">👤</span>
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Reported By</p>
                                                <p className="font-bold text-slate-800">{ticket.reportedBy || 'Staff Member'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Evidence Gallery */}
                                    {(ticket.imageUrls && ticket.imageUrls.length > 0) ? (
                                        <div className="mb-8">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Evidence Gallery</p>
                                            <div className="flex flex-wrap gap-4">
                                                {ticket.imageUrls.map((url, index) => (
                                                    <div key={index} className="relative group">
                                                        <img 
                                                            src={url.replace('/upload/', '/upload/c_fill,g_auto,h_400,w_400,q_auto,f_auto/')} 
                                                            alt="incident" 
                                                            className="w-24 h-24 object-cover rounded-[20px] border-4 border-white shadow-md group-hover:scale-105 transition-transform cursor-zoom-in"
                                                            onClick={() => window.open(url, '_blank')}
                                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mb-8 p-6 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-100 text-center">
                                            <p className="text-[10px] text-slate-400 font-black uppercase">No visual evidence</p>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="space-y-4 pt-8 border-t-2 border-slate-50 mt-auto">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Update Status</label>
                                            <select 
                                                className="w-full bg-slate-100 border-none text-sm font-black text-slate-700 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
                                                value={ticket.status}
                                                onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                                            >
                                                <option value="OPEN">⭕ OPEN</option>
                                                <option value="IN_PROGRESS">⏳ IN PROGRESS</option>
                                                <option value="RESOLVED">✅ RESOLVED</option>
                                                <option value="REJECTED">❌ REJECTED</option>
                                            </select>
                                        </div>
                                        
                                        <div className="flex gap-3">
                                            <button 
                                                onClick={() => navigate(`/tickets/${ticket.id}`)}
                                                className="flex-1 bg-slate-900 text-white px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
                                            >
                                                Details
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(ticket.id)}
                                                className="bg-rose-50 text-rose-500 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-white rounded-[60px] border-4 border-dashed border-slate-50">
                            <p className="text-slate-300 font-black text-2xl uppercase tracking-tighter">No Maintenance Records Found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketListPage 
