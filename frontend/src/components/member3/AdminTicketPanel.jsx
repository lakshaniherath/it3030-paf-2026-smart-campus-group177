import React, { useEffect, useMemo, useState } from "react";
import {
  FiTool, FiRefreshCw, FiSearch, FiTrash2, FiEye,
  FiAlertCircle, FiCheckCircle, FiClock,
} from "react-icons/fi";
import { getAllTickets, deleteTicket, updateTicketStatus } from "../../api/ticketApi";
import TicketStatusStepper from "../TicketStatusStepper";

const STATUS_STYLES = {
  OPEN:        "bg-blue-100 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-amber-100 text-amber-700 border-amber-200",
  RESOLVED:    "bg-emerald-100 text-emerald-700 border-emerald-200",
  CLOSED:      "bg-slate-100 text-slate-600 border-slate-200",
  REJECTED:    "bg-rose-100 text-rose-700 border-rose-200",
};

const PRIORITY_STYLES = {
  LOW:    "bg-slate-100 text-slate-600 border-slate-200",
  MEDIUM: "bg-amber-100 text-amber-700 border-amber-200",
  HIGH:   "bg-rose-100 text-rose-700 border-rose-200",
};

export default function AdminTicketPanel() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllTickets();
      const raw = Array.isArray(data) ? data : (data?.data || []);
      setTickets(raw.map(t => ({ ...t, id: t.id || t._id })));
    } catch {
      setError("Could not load tickets. Check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleStatusChange = async (id, newStatus) => {
    setMessage(""); setError("");
    try {
      await updateTicketStatus(id, newStatus);
      setMessage(`Ticket updated to ${newStatus}.`);
      fetchTickets();
      if (selectedTicket?.id === id) {
        setSelectedTicket(prev => ({ ...prev, status: newStatus }));
      }
    } catch {
      setError("Failed to update ticket status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      await deleteTicket(id);
      setMessage("Ticket deleted.");
      setTickets(prev => prev.filter(t => t.id !== id));
      if (selectedTicket?.id === id) setSelectedTicket(null);
    } catch {
      setError("Failed to delete ticket.");
    }
  };

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === "OPEN").length,
    inProgress: tickets.filter(t => t.status === "IN_PROGRESS").length,
    resolved: tickets.filter(t => t.status === "RESOLVED").length,
  }), [tickets]);

  const filtered = useMemo(() => {
    let list = tickets;
    if (activeTab !== "ALL") list = list.filter(t => t.status === activeTab);
    if (searchTerm) list = list.filter(t =>
      t.resourceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return list;
  }, [tickets, activeTab, searchTerm]);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, icon: <FiTool className="text-blue-500" />, bg: "bg-blue-50" },
          { label: "Open", value: stats.open, icon: <FiAlertCircle className="text-blue-600" />, bg: "bg-blue-50" },
          { label: "In Progress", value: stats.inProgress, icon: <FiClock className="text-amber-500" />, bg: "bg-amber-50" },
          { label: "Resolved", value: stats.resolved, icon: <FiCheckCircle className="text-emerald-500" />, bg: "bg-emerald-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-slate-200 ${s.bg} p-4 flex items-center gap-3`}>
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">{error}</div>}
      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm">{message}</div>}

      <div className={`grid gap-5 ${selectedTicket ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"}`}>
        {/* Ticket table */}
        <div className="rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
          {/* Tabs + search */}
          <div className="p-4 border-b border-blue-50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 flex-wrap">
              {["ALL","OPEN","IN_PROGRESS","RESOLVED","CLOSED","REJECTED"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-slate-600 hover:bg-blue-100"
                  }`}>
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <div className="relative">
                <FiSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                <input type="text" placeholder="Search..."
                  className="pl-8 pr-3 py-1.5 rounded-xl border border-blue-100 bg-white text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100 w-40"
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <button onClick={fetchTickets}
                className="p-1.5 rounded-xl bg-blue-50 border border-blue-100 text-slate-600 hover:bg-blue-100 transition">
                <FiRefreshCw size={13} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm">Loading tickets...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center">
              <FiTool className="mx-auto mb-2 text-slate-300" size={28} />
              <p className="text-slate-400 text-sm">No tickets found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-50 bg-blue-50/50 text-left">
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Resource</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Priority</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Update</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(ticket => (
                    <tr key={ticket.id}
                      className={`border-b border-slate-50 transition cursor-pointer ${
                        selectedTicket?.id === ticket.id ? "bg-blue-50" : "hover:bg-blue-50/30"
                      }`}
                      onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}>
                      <td className="py-3 px-4 text-xs font-mono text-slate-600 max-w-[80px] truncate">{ticket.resourceId}</td>
                      <td className="py-3 px-4 max-w-[160px] truncate text-slate-700 text-xs">{ticket.description}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${PRIORITY_STYLES[ticket.priority] || PRIORITY_STYLES.MEDIUM}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[ticket.status] || STATUS_STYLES.OPEN}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                        <select
                          className="rounded-lg border border-blue-100 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-200"
                          value={ticket.status}
                          onChange={e => handleStatusChange(ticket.id, e.target.value)}>
                          <option value="OPEN">OPEN</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                          <option value="CLOSED">CLOSED</option>
                          <option value="REJECTED">REJECTED</option>
                        </select>
                      </td>
                      <td className="py-3 px-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                            className="p-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 hover:bg-blue-100 transition" title="View details">
                            <FiEye size={12} />
                          </button>
                          <button onClick={() => handleDelete(ticket.id)}
                            className="p-1.5 rounded-lg bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-100 transition" title="Delete">
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selectedTicket && (
          <div className="rounded-2xl border border-blue-100 bg-white shadow-sm p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Ticket Details</h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">#{selectedTicket.id}</p>
              </div>
              <button onClick={() => setSelectedTicket(null)}
                className="text-slate-400 hover:text-slate-600 text-xs border border-slate-200 rounded-lg px-2 py-1">
                Close
              </button>
            </div>

            {/* Status stepper */}
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <p className="text-xs font-semibold text-slate-500 mb-3">Progress</p>
              <TicketStatusStepper currentStatus={selectedTicket.status || "OPEN"} />
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { label: "Resource", value: selectedTicket.resourceId },
                { label: "Category", value: selectedTicket.category || "—" },
                { label: "Priority", value: selectedTicket.priority },
                { label: "Reported By", value: selectedTicket.reportedBy || "—" },
                { label: "Contact", value: selectedTicket.contactDetails || "—" },
                { label: "Assigned To", value: selectedTicket.assignedTo || "Unassigned" },
              ].map(f => (
                <div key={f.label} className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                  <p className="text-slate-400 font-medium uppercase tracking-wide text-[10px] mb-0.5">{f.label}</p>
                  <p className="font-semibold text-slate-800 truncate">{f.value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-1">Description</p>
              <p className="text-slate-700 text-xs leading-relaxed">{selectedTicket.description}</p>
            </div>

            {/* Resolution note */}
            {selectedTicket.resolutionNote && (
              <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100">
                <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide mb-1">Resolution Note</p>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedTicket.resolutionNote}</p>
              </div>
            )}

            {/* Images */}
            {selectedTicket.imageUrls?.length > 0 && (
              <div>
                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-2">Evidence</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTicket.imageUrls.map((url, i) => (
                    <img key={i} src={url} alt={`evidence-${i}`}
                      className="w-16 h-16 object-cover rounded-xl border border-blue-100 cursor-pointer hover:scale-105 transition"
                      onClick={() => window.open(url, "_blank")}
                      onError={e => { e.target.src = "https://via.placeholder.com/64?text=Img"; }} />
                  ))}
                </div>
              </div>
            )}

            {/* Quick status update */}
            <div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide mb-1.5">Update Status</p>
              <select
                className="w-full rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={selectedTicket.status}
                onChange={e => handleStatusChange(selectedTicket.id, e.target.value)}>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
