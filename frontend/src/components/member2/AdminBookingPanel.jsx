import React, { useEffect, useMemo, useState } from "react";
import {
  FiCalendar, FiCheckCircle, FiXCircle,
  FiRefreshCw, FiFilter, FiChevronLeft, FiChevronRight,
  FiClock,
} from "react-icons/fi";
import bookingApi from "./bookingApi";

const STATUS_STYLES = {
  PENDING:   "bg-amber-100 text-amber-800 border border-amber-200",
  APPROVED:  "bg-emerald-100 text-emerald-800 border border-emerald-200",
  REJECTED:  "bg-rose-100 text-rose-800 border border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 border border-slate-200",
};

const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

// ── Mini Calendar ─────────────────────────────────────────────────────────────
function MiniCalendar({ bookings }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const pad = (n) => String(n).padStart(2, "0");
  const dateKey = (d) => `${year}-${pad(month + 1)}-${pad(d)}`;
  const todayKey = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;

  const bookingsByDate = useMemo(() => {
    const map = {};
    bookings.filter(b => b.status === "APPROVED" || b.status === "PENDING").forEach(b => {
      if (!map[b.bookingDate]) map[b.bookingDate] = [];
      map[b.bookingDate].push(b);
    });
    return map;
  }, [bookings]);

  const selectedBookings = selected ? (bookingsByDate[selected] || []) : [];

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm">
          <FiCalendar className="text-blue-500" size={15} /> Booking Calendar
        </h3>
        <div className="flex items-center gap-1">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="p-1 rounded-lg hover:bg-blue-50 text-slate-500 transition">
            <FiChevronLeft size={14} />
          </button>
          <span className="text-xs font-semibold text-slate-700 w-28 text-center">{MONTHS[month]} {year}</span>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="p-1 rounded-lg hover:bg-blue-50 text-slate-500 transition">
            <FiChevronRight size={14} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-0.5">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const key = dateKey(day);
          const dayBookings = bookingsByDate[key] || [];
          const isToday = key === todayKey;
          const isSelected = selected === key;
          return (
            <button key={day} onClick={() => setSelected(isSelected ? null : key)}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-start pt-0.5 text-[11px] font-semibold transition ${
                isSelected ? "bg-blue-600 text-white" :
                isToday ? "bg-cyan-50 border border-cyan-300 text-cyan-700" :
                dayBookings.length > 0 ? "bg-blue-50 hover:bg-blue-100 text-slate-800" :
                "hover:bg-slate-50 text-slate-500"
              }`}>
              {day}
              {dayBookings.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 justify-center">
                  {dayBookings.slice(0, 3).map((b, i) => (
                    <span key={i} className={`w-1 h-1 rounded-full ${
                      isSelected ? "bg-white" :
                      b.status === "APPROVED" ? "bg-emerald-500" : "bg-amber-400"
                    }`} />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>
      {selected && (
        <div className="mt-3 border-t border-blue-50 pt-3 space-y-2">
          <p className="text-xs font-semibold text-slate-500">{selected} — {selectedBookings.length} booking(s)</p>
          {selectedBookings.length === 0
            ? <p className="text-xs text-slate-400">No bookings on this day.</p>
            : selectedBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2">
                <div>
                  <p className="text-xs font-semibold text-slate-800">{b.purpose}</p>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <FiClock size={9} /> {b.startTime}–{b.endTime} · <span className="font-mono">{b.resourceId}</span>
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${STATUS_STYLES[b.status] || ""}`}>{b.status}</span>
              </div>
            ))
          }
        </div>
      )}
      <div className="flex gap-3 mt-2 text-[10px] text-slate-400 border-t border-blue-50 pt-2">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>Approved</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>Pending</span>
      </div>
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────
export default function AdminBookingPanel() {
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [activeTab, setActiveTab] = useState("ALL");

  // Fetch resources
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await bookingApi.get("/api/resources?size=100");
        setResources(res.data?.content || []);
      } catch (e) {
        console.error("Failed to fetch resources:", e);
      }
    };
    fetchResources();
  }, []);

  const loadBookings = async (status, date) => {
    setError("");
    try {
      const params = {};
      if (status) params.status = status;
      if (date) params.bookingDate = date;
      const res = await bookingApi.get("/api/member2/bookings", { params });
      setBookings(res.data || []);
    } catch (e) {
      setError("Failed to load bookings. Ensure you are logged in as ADMIN.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBookings(); }, []);
  
  // Helper to get resource name
  const getResourceName = (resourceId) => {
    const resource = resources.find(r => r.id === resourceId);
    return resource ? resource.name : resourceId;
  };

  const updateStatus = async (id, status, reason = null) => {
    setMessage(""); setError("");
    try {
      const payload = { status };
      if (reason) payload.rejectionReason = reason;
      await bookingApi.patch(`/api/member2/bookings/${id}/status`, payload);
      setMessage(`Booking ${status.toLowerCase()}.`);
      loadBookings(filterStatus, filterDate);
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || "Failed to update booking.";
      setError(msg);
    }
  };

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    approved: bookings.filter(b => b.status === "APPROVED").length,
    rejected: bookings.filter(b => b.status === "REJECTED").length,
  }), [bookings]);

  const displayed = useMemo(() => {
    if (activeTab === "PENDING") return bookings.filter(b => b.status === "PENDING");
    if (activeTab === "APPROVED") return bookings.filter(b => b.status === "APPROVED");
    if (activeTab === "REJECTED") return bookings.filter(b => b.status === "REJECTED");
    return bookings;
  }, [bookings, activeTab]);

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Pending", value: stats.pending, color: "text-amber-700", bg: "bg-amber-50" },
          { label: "Approved", value: stats.approved, color: "text-emerald-700", bg: "bg-emerald-50" },
          { label: "Rejected", value: stats.rejected, color: "text-rose-700", bg: "bg-rose-50" },
        ].map(s => (
          <div key={s.label} className={`rounded-2xl border border-slate-200 ${s.bg} p-4`}>
            <p className="text-xs text-slate-500 font-medium">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">{error}</div>}
      {message && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm">{message}</div>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Bookings table */}
        <div className="xl:col-span-2 rounded-2xl border border-blue-100 bg-white shadow-sm overflow-hidden">
          {/* Tabs + filters */}
          <div className="p-4 border-b border-blue-50 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1">
              {["ALL","PENDING","APPROVED","REJECTED"].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    activeTab === tab
                      ? "bg-blue-600 text-white"
                      : "bg-blue-50 text-slate-600 hover:bg-blue-100"
                  }`}>
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <input type="date"
                className="rounded-xl border border-blue-100 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={filterDate} onChange={e => setFilterDate(e.target.value)} />
              <button onClick={() => loadBookings(filterStatus, filterDate)}
                className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-slate-700 text-xs flex items-center gap-1.5 hover:bg-blue-100 transition">
                <FiFilter size={12} /> Filter
              </button>
              <button onClick={() => { setFilterStatus(""); setFilterDate(""); loadBookings(); }}
                className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-slate-700 text-xs flex items-center gap-1.5 hover:bg-blue-100 transition">
                <FiRefreshCw size={12} /> Reset
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-10 text-center text-slate-400 text-sm">Loading bookings...</div>
          ) : displayed.length === 0 ? (
            <div className="p-10 text-center text-slate-400 text-sm">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-blue-50 bg-blue-50/50 text-left">
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Resource</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Time</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Purpose</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {displayed.map(b => {
                    const resourceName = getResourceName(b.resourceId);
                    return (
                    <tr key={b.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition">
                      <td className="py-3 px-4 text-slate-700 max-w-[150px]">
                        <div className="truncate font-semibold">{resourceName}</div>
                        {resourceName !== b.resourceId && (
                          <div className="text-xs text-slate-400 font-mono truncate">{b.resourceId}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-700">{b.bookingDate}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-slate-700">{b.startTime}–{b.endTime}</td>
                      <td className="py-3 px-4 max-w-[140px] truncate text-slate-700">{b.purpose}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status] || ""}`}>{b.status}</span>
                      </td>
                      <td className="py-3 px-4">
                        {b.status === "PENDING" && (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => updateStatus(b.id, "APPROVED")}
                              className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition" title="Approve">
                              <FiCheckCircle size={13} />
                            </button>
                            <button onClick={() => { setRejectTarget(b); setRejectReason(""); }}
                              className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition" title="Reject">
                              <FiXCircle size={13} />
                            </button>
                          </div>
                        )}
                        {b.status !== "PENDING" && (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="xl:col-span-1">
          <MiniCalendar bookings={bookings} />
        </div>
      </div>

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Reject Booking</h3>
            <p className="text-sm text-slate-500 mb-4">
              Rejecting: <span className="font-semibold text-slate-700">{rejectTarget.purpose}</span>
              <span className="ml-2 text-xs text-slate-400">{rejectTarget.bookingDate} · {rejectTarget.startTime}–{rejectTarget.endTime}</span>
            </p>
            <textarea
              className="w-full min-h-24 rounded-xl border border-blue-100 bg-white px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100 resize-none"
              value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Hall is under maintenance on this date" />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => { setRejectTarget(null); setRejectReason(""); }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button onClick={async () => {
                  if (!rejectReason.trim()) { setError("Please provide a rejection reason."); return; }
                  await updateStatus(rejectTarget.id, "REJECTED", rejectReason.trim());
                  setRejectTarget(null); setRejectReason("");
                }}
                className="px-4 py-2 rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 transition">
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
