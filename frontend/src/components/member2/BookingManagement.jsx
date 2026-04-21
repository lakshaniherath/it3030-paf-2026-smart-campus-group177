import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiCalendar, FiCheckCircle, FiXCircle, FiTrash2,
  FiRefreshCw, FiPlusCircle, FiFilter, FiLogOut,
  FiAlertTriangle, FiClock, FiChevronLeft, FiChevronRight, FiStar,
} from "react-icons/fi";
import bookingApi from "./bookingApi";
import axios from "axios";
import FavoritesPanel from "./FavoritesPanel";

const fetchResources = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/resources?size=100");
    return res.data?.content || [];
  } catch {
    return [];
  }
};

const initialForm = {
  resourceId: "", bookingDate: "", startTime: "", endTime: "",
  purpose: "", expectedAttendees: 1,
};

const STATUS_STYLES = {
  PENDING:   "bg-amber-100 text-amber-800 border border-amber-200",
  APPROVED:  "bg-emerald-100 text-emerald-800 border border-emerald-200",
  REJECTED:  "bg-rose-100 text-rose-800 border border-rose-200",
  CANCELLED: "bg-slate-100 text-slate-600 border border-slate-200",
};

// ── helpers ──────────────────────────────────────────────────────────────────
const toMinutes = (t) => {
  if (!t) return 0;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

const parseConflictMessage = (msg) => {
  if (!msg || !msg.startsWith("CONFLICT:")) return null;
  const parts = msg.replace("CONFLICT:", "").split(":");
  return { time: parts[0] || "", purpose: parts[1] || "Existing booking", status: parts[2] || "" };
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June",
                "July","August","September","October","November","December"];

// ── Availability Timeline ─────────────────────────────────────────────────────
function AvailabilityTimeline({ slots, requestStart, requestEnd }) {
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 08:00–20:00
  const totalMins = 12 * 60;
  const startBase = 8 * 60;

  const pct = (t) => ((toMinutes(t) - startBase) / totalMins) * 100;
  const width = (s, e) => Math.max(((toMinutes(e) - toMinutes(s)) / totalMins) * 100, 1);

  const reqStart = requestStart ? pct(requestStart) : null;
  const reqWidth = requestStart && requestEnd ? width(requestStart, requestEnd) : 0;

  return (
    <div className="mt-3">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
        Availability Timeline (08:00 – 20:00)
      </p>
      <div className="relative h-10 bg-emerald-50 border border-emerald-100 rounded-xl overflow-hidden">
        {/* Hour markers */}
        {hours.map((h) => (
          <div key={h} className="absolute top-0 bottom-0 border-l border-slate-200/60"
            style={{ left: `${((h * 60 - startBase) / totalMins) * 100}%` }}>
            <span className="absolute -top-0.5 left-0.5 text-[9px] text-slate-400">{h}:00</span>
          </div>
        ))}
        {/* Existing booked slots */}
        {slots.map((s, i) => (
          <div key={i}
            className={`absolute top-1 bottom-1 rounded-lg flex items-center justify-center text-[9px] font-bold text-white overflow-hidden ${
              s.status === "APPROVED" ? "bg-rose-400" : "bg-amber-400"
            }`}
            style={{ left: `${pct(s.startTime)}%`, width: `${width(s.startTime, s.endTime)}%` }}
            title={`${s.startTime}–${s.endTime}: ${s.purpose} (${s.status})`}
          >
            <span className="truncate px-1">{s.startTime}–{s.endTime}</span>
          </div>
        ))}
        {/* Requested slot */}
        {reqStart !== null && reqWidth > 0 && (
          <div className="absolute top-1 bottom-1 rounded-lg bg-blue-500/70 border-2 border-blue-600 flex items-center justify-center text-[9px] font-bold text-white"
            style={{ left: `${reqStart}%`, width: `${reqWidth}%` }}
            title="Your requested slot">
            <span className="truncate px-1">Your slot</span>
          </div>
        )}
      </div>
      <div className="flex gap-3 mt-1.5 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-rose-400 inline-block"/>Approved</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-400 inline-block"/>Pending</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"/>Your request</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-200 inline-block"/>Available</span>
      </div>
    </div>
  );
}

// ── Booking Calendar ──────────────────────────────────────────────────────────
function BookingCalendar({ bookings, resources }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const approvedBookings = useMemo(() =>
    bookings.filter(b => b.status === "APPROVED" || b.status === "PENDING"),
  [bookings]);

  const bookingsByDate = useMemo(() => {
    const map = {};
    approvedBookings.forEach(b => {
      const key = b.bookingDate;
      if (!map[key]) map[key] = [];
      map[key].push(b);
    });
    return map;
  }, [approvedBookings]);

  const pad = (n) => String(n).padStart(2, "0");
  const dateKey = (d) => `${year}-${pad(month + 1)}-${pad(d)}`;

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectedBookings = selected ? (bookingsByDate[selected] || []) : [];

  return (
    <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      {/* Calendar header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <FiCalendar className="text-blue-500" size={16} />
          Booking Calendar
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-600 transition">
            <FiChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-slate-700 w-32 text-center">
            {MONTHS[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-600 transition">
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(d => (
          <div key={d} className="text-center text-xs font-semibold text-slate-400 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const key = dateKey(day);
          const dayBookings = bookingsByDate[key] || [];
          const isToday = key === `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
          const isSelected = selected === key;
          return (
            <button key={day} onClick={() => setSelected(isSelected ? null : key)}
              className={`relative aspect-square rounded-xl flex flex-col items-center justify-start pt-1 text-xs font-semibold transition ${
                isSelected ? "bg-blue-600 text-white" :
                isToday ? "bg-cyan-50 border border-cyan-300 text-cyan-700" :
                dayBookings.length > 0 ? "bg-blue-50 hover:bg-blue-100 text-slate-800" :
                "hover:bg-slate-50 text-slate-600"
              }`}>
              {day}
              {dayBookings.length > 0 && (
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                  {dayBookings.slice(0, 3).map((b, i) => (
                    <span key={i} className={`w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white" :
                      b.status === "APPROVED" ? "bg-emerald-500" : "bg-amber-400"
                    }`} />
                  ))}
                  {dayBookings.length > 3 && (
                    <span className={`text-[8px] ${isSelected ? "text-white" : "text-slate-400"}`}>+{dayBookings.length-3}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day bookings */}
      {selected && (
        <div className="mt-4 border-t border-blue-50 pt-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            {selected} — {selectedBookings.length} booking{selectedBookings.length !== 1 ? "s" : ""}
          </p>
          {selectedBookings.length === 0 ? (
            <p className="text-sm text-slate-400">No bookings on this day.</p>
          ) : (
            <div className="space-y-2">
              {selectedBookings.map(b => {
                const resource = resources.find(r => r.id === b.resourceId);
                const resourceName = resource ? resource.name : b.resourceId;
                return (
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-blue-100 bg-blue-50/50 px-3 py-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{b.purpose}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <FiClock size={10} /> {b.startTime} – {b.endTime}
                      <span className="ml-1 text-slate-600">{resourceName}</span>
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${STATUS_STYLES[b.status] || ""}`}>
                    {b.status}
                  </span>
                </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="flex gap-3 mt-3 text-[10px] text-slate-500 border-t border-blue-50 pt-3">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"/>Approved</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block"/>Pending</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-300 border border-cyan-400 inline-block"/>Today</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
function BookingManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const [me, setMe] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [resources, setResources] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [conflictInfo, setConflictInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("CREATE");
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [adminStatus, setAdminStatus] = useState("");
  const [adminDate, setAdminDate] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const isAdmin = useMemo(() => me?.role?.toUpperCase() === "ADMIN", [me]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const meRes = await bookingApi.get("/api/member2/auth/me");
        setMe(meRes.data);
        const listRes = await bookingApi.get("/api/member2/bookings");
        setBookings(listRes.data || []);
        const resList = await fetchResources();
        setResources(resList);

        // Pre-select resource from URL query param (e.g. coming from resource detail page)
        const params = new URLSearchParams(location.search);
        const preselectedId = params.get("resourceId");
        if (preselectedId) {
          setForm(prev => ({ ...prev, resourceId: preselectedId }));
          fetchAvailability(preselectedId, "");
        }
      } catch {
        setError("Could not load booking data. Please ensure you are logged in.");
      } finally {
        setLoading(false);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Fetch availability whenever resourceId + bookingDate change
  const fetchAvailability = useCallback(async (resourceId, date) => {
    if (!resourceId || !date) { setAvailabilitySlots([]); return; }
    setAvailabilityLoading(true);
    try {
      const res = await bookingApi.get("/api/member2/bookings/availability", {
        params: { resourceId, date },
      });
      setAvailabilitySlots(res.data || []);
    } catch {
      setAvailabilitySlots([]);
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  const onFormChange = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);
    setConflictInfo(null);
    if (key === "resourceId" || key === "bookingDate") {
      fetchAvailability(
        key === "resourceId" ? value : updated.resourceId,
        key === "bookingDate" ? value : updated.bookingDate
      );
    }
  };

  const loadBookings = async () => {
    const params = {};
    if (isAdmin) {
      if (adminStatus) params.status = adminStatus;
      if (adminDate) params.bookingDate = adminDate;
    }
    const res = await bookingApi.get("/api/member2/bookings", { params });
    setBookings(res.data || []);
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setMessage(""); setError(""); setConflictInfo(null);
    try {
      await bookingApi.post("/api/member2/bookings", {
        ...form, expectedAttendees: Number(form.expectedAttendees),
      });
      setMessage("Booking request submitted. Status: PENDING");
      setForm(initialForm);
      setAvailabilitySlots([]);
      await loadBookings();
      setActiveSection("MY_BOOKINGS");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "";
      const errors = err?.response?.data?.errors;
      const validationMsg = errors ? Object.values(errors).join(", ") : "";
      const fullMsg = validationMsg || msg || "Failed to submit booking request.";
      const conflict = parseConflictMessage(fullMsg);
      if (conflict) {
        setConflictInfo(conflict);
        setError("");
      } else {
        setError(fullMsg);
      }
    }
  };

  const updateStatus = async (bookingId, status, rejectionReasonValue) => {
    setMessage(""); setError("");
    try {
      await bookingApi.patch(`/api/member2/bookings/${bookingId}/status`, {
        status, rejectionReason: rejectionReasonValue,
      });
      setMessage(`Booking updated to ${status}.`);
      await loadBookings();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update booking status.");
    }
  };

  const deletePendingBooking = async (bookingId) => {
    setMessage(""); setError("");
    try {
      await bookingApi.delete(`/api/member2/bookings/${bookingId}`);
      setMessage("Pending booking deleted.");
      await loadBookings();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete booking.");
    }
  };

  const stats = useMemo(() => ({
    total: bookings.length,
    pending: bookings.filter(b => b.status === "PENDING").length,
    approved: bookings.filter(b => b.status === "APPROVED").length,
    rejected: bookings.filter(b => b.status === "REJECTED").length,
  }), [bookings]);

  const navItems = [
    { id: "CREATE", label: "New Booking", icon: <FiPlusCircle /> },
    { id: "FAVORITES", label: "My Favorites", icon: <FiStar /> },
    { id: "MY_BOOKINGS", label: isAdmin ? "All Bookings" : "My Bookings", icon: <FiCalendar /> },
    { id: "CALENDAR", label: "Booking Calendar", icon: <FiCalendar /> },
    ...(isAdmin ? [{ id: "APPROVALS", label: "Pending Approvals", icon: <FiCheckCircle /> }] : []),
  ];

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center text-slate-800">
      Loading bookings...
    </div>
  );

  if (!me) return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-blue-100 bg-white p-8 shadow-lg text-center">
        <FiCalendar className="mx-auto text-blue-400 mb-4" size={40} />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Management</h2>
        <p className="text-slate-600 mb-6">{error || "Please log in to access bookings."}</p>
        <button onClick={() => navigate("/login")}
          className="w-full py-3 rounded-2xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition">
          Go to Login
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-72 bg-gradient-to-b from-blue-800 via-blue-700 to-cyan-700 px-4 py-6 hidden md:block">
          <h2 className="text-xl font-bold text-white px-2">Booking Module</h2>
          <nav className="mt-8 space-y-2">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition ${
                  activeSection === item.id
                    ? "bg-cyan-400 text-slate-950 border-cyan-300 font-semibold"
                    : "bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300"
                }`}>
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 space-y-2 px-1">
            <p className="text-xs text-blue-200 uppercase tracking-widest px-1 mb-3">Overview</p>
            {[
              { label: "Total", value: stats.total, color: "text-white" },
              { label: "Pending", value: stats.pending, color: "text-amber-300" },
              { label: "Approved", value: stats.approved, color: "text-emerald-300" },
              { label: "Rejected", value: stats.rejected, color: "text-rose-300" },
            ].map(s => (
              <div key={s.label} className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2">
                <span className="text-sm text-blue-100">{s.label}</span>
                <span className={`font-bold text-lg ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-8">
          <header className="rounded-2xl border border-blue-100 bg-white p-4 md:p-6 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-blue-900">Booking Management</h1>
              <p className="text-slate-600 mt-1">
                Logged in as <span className="font-semibold">{me.name || me.email}</span>
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700 border border-blue-200">{me.role || "USER"}</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadBookings}
                className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-cyan-50 transition flex items-center gap-2 text-slate-700">
                <FiRefreshCw /> Refresh
              </button>
              <button onClick={() => navigate("/dashboard")}
                className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-cyan-50 transition flex items-center gap-2 text-slate-700">
                <FiLogOut /> Dashboard
              </button>
            </div>
          </header>

          {error && <div className="mb-4 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-rose-800 text-sm">{error}</div>}
          {message && <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-emerald-800 text-sm">{message}</div>}

          {/* ── CREATE BOOKING ── */}
          {activeSection === "CREATE" && (
            <section className="max-w-2xl space-y-4">
              <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
                  <FiPlusCircle className="text-blue-500" /> New Booking Request
                </h2>
                <form onSubmit={submitBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Resource</label>
                    <select
                      className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={form.resourceId}
                      onChange={e => onFormChange("resourceId", e.target.value)}
                      required
                    >
                      <option value="">— Select a resource —</option>
                      {resources.filter(r => r.status === "ACTIVE").map(r => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.type?.replace(/_/g, " ")}) — {r.location} · Cap: {r.capacity}
                        </option>
                      ))}
                      {resources.filter(r => r.status !== "ACTIVE").length > 0 && (
                        <>
                          <option disabled>── Unavailable ──</option>
                          {resources.filter(r => r.status !== "ACTIVE").map(r => (
                            <option key={r.id} value={r.id} disabled>
                              {r.name} [{r.status}]
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    {resources.length === 0 && (
                      <p className="text-xs text-slate-400 mt-1">No resources loaded — type an ID manually if needed.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Booking Date</label>
                    <input type="date"
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={form.bookingDate} onChange={e => onFormChange("bookingDate", e.target.value)} required />
                  </div>

                  {/* Availability timeline */}
                  {(form.resourceId && form.bookingDate) && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
                      {availabilityLoading ? (
                        <p className="text-xs text-slate-500">Checking availability...</p>
                      ) : (
                        <AvailabilityTimeline
                          slots={availabilitySlots}
                          requestStart={form.startTime}
                          requestEnd={form.endTime}
                        />
                      )}
                    </div>
                  )}

                  {/* Conflict alert */}
                  {conflictInfo && (
                    <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
                      <FiAlertTriangle className="text-rose-500 flex-shrink-0 mt-0.5" size={18} />
                      <div>
                        <p className="font-semibold text-rose-800 text-sm">Scheduling Conflict Detected</p>
                        <p className="text-rose-700 text-sm mt-1">
                          This resource is already booked from <span className="font-bold">{conflictInfo.time}</span>
                          {conflictInfo.purpose && <> for <span className="font-bold">"{conflictInfo.purpose}"</span></>}
                          {conflictInfo.status && <span className="ml-1 px-1.5 py-0.5 rounded text-xs bg-rose-100 border border-rose-200">{conflictInfo.status}</span>}.
                        </p>
                        <p className="text-rose-600 text-xs mt-1">Please choose a different time slot. Check the timeline above for available windows.</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
                      <input type="time"
                        className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={form.startTime} onChange={e => onFormChange("startTime", e.target.value)} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
                      <input type="time"
                        className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        value={form.endTime} onChange={e => onFormChange("endTime", e.target.value)} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Purpose</label>
                    <input className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      placeholder="Describe the purpose of booking" value={form.purpose}
                      onChange={e => onFormChange("purpose", e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expected Attendees</label>
                    <input type="number" min={1}
                      className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={form.expectedAttendees} onChange={e => onFormChange("expectedAttendees", e.target.value)} required />
                  </div>
                  <button type="submit"
                    className="w-full py-3 rounded-2xl bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 transition mt-2">
                    Submit Booking Request
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* ── CALENDAR ── */}
          {activeSection === "CALENDAR" && (
            <section className="max-w-2xl">
              <BookingCalendar bookings={bookings} resources={resources} />
            </section>
          )}

          {/* ── FAVORITES ── */}
          {activeSection === "FAVORITES" && (
            <section>
              <FavoritesPanel />
            </section>
          )}

          {/* ── MY BOOKINGS ── */}
          {activeSection === "MY_BOOKINGS" && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <FiCalendar className="text-blue-500" />
                  {isAdmin ? "All Bookings" : "My Bookings"}
                </h2>
                {isAdmin && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <select className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={adminStatus} onChange={e => setAdminStatus(e.target.value)}>
                      <option value="">All Statuses</option>
                      <option value="PENDING">PENDING</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <input type="date"
                      className="rounded-xl border border-blue-100 bg-white px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
                      value={adminDate} onChange={e => setAdminDate(e.target.value)} />
                    <button onClick={loadBookings}
                      className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-blue-100 text-slate-700 text-sm flex items-center gap-2 transition">
                      <FiFilter /> Filter
                    </button>
                  </div>
                )}
              </div>
              {bookings.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FiCalendar className="mx-auto mb-3 text-slate-300" size={40} />
                  <p>No bookings found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 text-left">
                        <th className="py-3 px-2 font-semibold">Resource</th>
                        <th className="py-3 px-2 font-semibold">Date</th>
                        <th className="py-3 px-2 font-semibold">Time</th>
                        <th className="py-3 px-2 font-semibold">Purpose</th>
                        <th className="py-3 px-2 font-semibold">Attendees</th>
                        <th className="py-3 px-2 font-semibold">Status</th>
                        <th className="py-3 px-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map(b => {
                        const resource = resources.find(r => r.id === b.resourceId);
                        const resourceName = resource ? resource.name : b.resourceId;
                        return (
                        <tr key={b.id} className="border-b border-slate-50 hover:bg-blue-50/40 transition">
                          <td className="py-3 px-2 text-slate-700">{resourceName}</td>
                          <td className="py-3 px-2">{b.bookingDate}</td>
                          <td className="py-3 px-2 whitespace-nowrap">{b.startTime} – {b.endTime}</td>
                          <td className="py-3 px-2 max-w-[160px] truncate">{b.purpose}</td>
                          <td className="py-3 px-2 text-center">{b.expectedAttendees}</td>
                          <td className="py-3 px-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLES[b.status] || ""}`}>{b.status}</span>
                          </td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-1.5">
                              {isAdmin && b.status === "PENDING" && (
                                <>
                                  <button onClick={() => updateStatus(b.id, "APPROVED")}
                                    className="p-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition" title="Approve">
                                    <FiCheckCircle size={14} />
                                  </button>
                                  <button onClick={() => { setRejectTarget(b); setRejectReason(""); }}
                                    className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition" title="Reject">
                                    <FiXCircle size={14} />
                                  </button>
                                </>
                              )}
                              {!isAdmin && b.status === "APPROVED" && (
                                <button onClick={() => updateStatus(b.id, "CANCELLED")}
                                  className="px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-medium transition">
                                  Cancel
                                </button>
                              )}
                              {!isAdmin && b.status === "PENDING" && (
                                <button onClick={() => deletePendingBooking(b.id)}
                                  className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition" title="Delete">
                                  <FiTrash2 size={14} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ── APPROVALS ── */}
          {activeSection === "APPROVALS" && isAdmin && (
            <section className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
                <FiCheckCircle className="text-blue-500" /> Pending Approvals
              </h2>
              {bookings.filter(b => b.status === "PENDING").length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <FiCheckCircle className="mx-auto mb-3 text-slate-300" size={40} />
                  <p>No pending bookings to review.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.filter(b => b.status === "PENDING").map(b => {
                    const resource = resources.find(r => r.id === b.resourceId);
                    const resourceName = resource ? resource.name : b.resourceId;
                    return (
                    <div key={b.id} className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-slate-800">{b.purpose}</p>
                        <p className="text-sm text-slate-500 mt-0.5">
                          <span className="font-semibold">{resourceName}</span> · {b.bookingDate} · {b.startTime}–{b.endTime} · {b.expectedAttendees} attendees
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(b.id, "APPROVED")}
                          className="px-4 py-2 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 font-semibold text-sm hover:bg-emerald-200 transition flex items-center gap-1.5">
                          <FiCheckCircle size={14} /> Approve
                        </button>
                        <button onClick={() => { setRejectTarget(b); setRejectReason(""); }}
                          className="px-4 py-2 rounded-xl bg-rose-100 border border-rose-200 text-rose-800 font-semibold text-sm hover:bg-rose-200 transition flex items-center gap-1.5">
                          <FiXCircle size={14} /> Reject
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* Reject Modal */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Reject Booking</h3>
            <p className="text-sm text-slate-500 mb-4">
              Provide a reason for rejecting: <span className="font-semibold text-slate-700">{rejectTarget.purpose}</span>
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

export default BookingManagement;
