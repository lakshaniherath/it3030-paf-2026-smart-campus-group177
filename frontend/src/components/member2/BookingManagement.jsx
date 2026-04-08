import React, { useEffect, useMemo, useState } from "react";
import bookingApi from "./bookingApi";

const initialForm = {
  resourceId: "",
  bookingDate: "",
  startTime: "",
  endTime: "",
  purpose: "",
  expectedAttendees: 1,
};

const statusStyles = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-rose-100 text-rose-800",
  CANCELLED: "bg-slate-200 text-slate-700",
};

function BookingManagement() {
  const [me, setMe] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [adminStatus, setAdminStatus] = useState("");
  const [adminDate, setAdminDate] = useState("");

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  const isAdmin = useMemo(() => {
    return me?.role?.toUpperCase() === "ADMIN";
  }, [me]);

  useEffect(() => {
    const runBootstrap = async () => {
      setLoading(true);
      setError("");
      try {
        const meRes = await bookingApi.get("/api/member2/auth/me");
        setMe(meRes.data);

        const listRes = await bookingApi.get("/api/member2/bookings");
        setBookings(listRes.data || []);
      } catch (e) {
        setError("Please login with Google to use Booking Management.");
      } finally {
        setLoading(false);
      }
    };

    runBootstrap();
  }, []);

  const loadBookings = async (roleOverride) => {
    const effectiveRole = (roleOverride || me?.role || "").toUpperCase();
    const params = {};

    if (effectiveRole === "ADMIN") {
      if (adminStatus) params.status = adminStatus;
      if (adminDate) params.bookingDate = adminDate;
    }

    const res = await bookingApi.get("/api/member2/bookings", { params });
    setBookings(res.data || []);
  };

  const onFormChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await bookingApi.post("/api/member2/bookings", {
        ...form,
        expectedAttendees: Number(form.expectedAttendees),
      });
      setMessage("Request submitted successfully. Status: PENDING");
      setForm(initialForm);
      await loadBookings();
    } catch (err) {
      const apiError = err?.response?.data?.message || "Failed to submit booking request.";
      setError(apiError);
    }
  };

  const updateStatus = async (bookingId, status, rejectionReasonValue) => {
    setMessage("");
    setError("");
    try {
      await bookingApi.patch(`/api/member2/bookings/${bookingId}/status`, {
        status,
        rejectionReason: rejectionReasonValue,
      });
      setMessage(`Booking updated to ${status}.`);
      await loadBookings();
    } catch (err) {
      const apiError = err?.response?.data?.message || "Failed to update booking status.";
      setError(apiError);
    }
  };

  const deletePendingBooking = async (bookingId) => {
    setMessage("");
    setError("");
    try {
      await bookingApi.delete(`/api/member2/bookings/${bookingId}`);
      setMessage("Pending booking deleted.");
      await loadBookings();
    } catch (err) {
      const apiError = err?.response?.data?.message || "Failed to delete booking.";
      setError(apiError);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 p-10">Loading booking module...</div>;
  }

  if (!me) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold mb-3">Booking Management (Member 2)</h2>
          <p className="text-slate-300 mb-5">{error || "Please login first."}</p>
          <button
            onClick={() => {
              window.location.href = "http://localhost:8080/oauth2/authorization/google";
            }}
            className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400"
          >
            Login with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#0e7490_0,#0f172a_45%,#020617_100%)] text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="bg-white/5 border border-cyan-200/20 rounded-2xl p-6 backdrop-blur">
          <h1 className="text-3xl font-bold tracking-tight">Booking Management</h1>
          <p className="text-slate-300 mt-1">
            Logged in as {me.name || me.email} ({me.role || "USER"})
          </p>
        </header>

        {message && <div className="bg-emerald-500/20 border border-emerald-300/40 text-emerald-100 px-4 py-3 rounded-xl">{message}</div>}
        {error && <div className="bg-rose-500/20 border border-rose-300/40 text-rose-100 px-4 py-3 rounded-xl">{error}</div>}

        <section className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-5">
            <h2 className="text-xl font-semibold mb-4">Create Booking Request</h2>
            <form onSubmit={submitBooking} className="space-y-3">
              <input
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2"
                placeholder="Resource ID"
                value={form.resourceId}
                onChange={(e) => onFormChange("resourceId", e.target.value)}
                required
              />
              <input
                type="date"
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2"
                value={form.bookingDate}
                onChange={(e) => onFormChange("bookingDate", e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="time"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2"
                  value={form.startTime}
                  onChange={(e) => onFormChange("startTime", e.target.value)}
                  required
                />
                <input
                  type="time"
                  className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2"
                  value={form.endTime}
                  onChange={(e) => onFormChange("endTime", e.target.value)}
                  required
                />
              </div>
              <input
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2"
                placeholder="Purpose"
                value={form.purpose}
                onChange={(e) => onFormChange("purpose", e.target.value)}
                required
              />
              <input
                type="number"
                min={1}
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2"
                placeholder="Expected Attendees"
                value={form.expectedAttendees}
                onChange={(e) => onFormChange("expectedAttendees", e.target.value)}
                required
              />
              <button className="w-full mt-2 px-4 py-2 rounded-lg bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300">
                Submit Request
              </button>
            </form>
          </div>

          <div className="lg:col-span-3 bg-white/5 border border-white/10 rounded-2xl p-5 overflow-x-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-xl font-semibold">{isAdmin ? "Booking Approvals Dashboard" : "My Bookings"}</h2>
              {isAdmin && (
                <div className="flex gap-2">
                  <select
                    className="bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2"
                    value={adminStatus}
                    onChange={(e) => setAdminStatus(e.target.value)}
                  >
                    <option value="">All Status</option>
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <input
                    type="date"
                    className="bg-slate-900/60 border border-white/10 rounded-lg px-3 py-2"
                    value={adminDate}
                    onChange={(e) => setAdminDate(e.target.value)}
                  />
                  <button
                    onClick={() => loadBookings()}
                    className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600"
                  >
                    Filter
                  </button>
                </div>
              )}
            </div>

            <table className="w-full text-sm min-w-[860px]">
              <thead>
                <tr className="text-left border-b border-white/10 text-slate-300">
                  <th className="py-2">Resource</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Purpose</th>
                  <th className="py-2">Attendees</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-white/5">
                    <td className="py-2">{b.resourceId}</td>
                    <td className="py-2">{b.bookingDate}</td>
                    <td className="py-2">{b.startTime} - {b.endTime}</td>
                    <td className="py-2">{b.purpose}</td>
                    <td className="py-2">{b.expectedAttendees}</td>
                    <td className="py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusStyles[b.status] || "bg-slate-200 text-slate-800"}`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="py-2 space-x-2">
                      {isAdmin && b.status === "PENDING" && (
                        <>
                          <button
                            className="px-2 py-1 rounded-md bg-emerald-500/90 text-white"
                            onClick={() => updateStatus(b.id, "APPROVED")}
                          >
                            Approve
                          </button>
                          <button
                            className="px-2 py-1 rounded-md bg-rose-500/90 text-white"
                            onClick={() => {
                              setRejectTarget(b);
                              setRejectReason("");
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {!isAdmin && b.status === "APPROVED" && (
                        <button
                          className="px-2 py-1 rounded-md bg-slate-600 hover:bg-slate-500 text-white"
                          onClick={() => updateStatus(b.id, "CANCELLED")}
                        >
                          Cancel
                        </button>
                      )}

                      {!isAdmin && b.status === "PENDING" && (
                        <button
                          className="px-2 py-1 rounded-md bg-slate-700 hover:bg-slate-600 text-white"
                          onClick={() => deletePendingBooking(b.id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {rejectTarget && (
        <div className="fixed inset-0 bg-slate-950/70 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-5">
            <h3 className="text-lg font-semibold mb-3">Reject Booking</h3>
            <p className="text-slate-300 text-sm mb-3">Provide a reason for rejection.</p>
            <textarea
              className="w-full min-h-24 bg-slate-800 border border-white/10 rounded-lg p-3"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Example: Hall is under maintenance"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 rounded-lg bg-slate-700"
                onClick={() => {
                  setRejectTarget(null);
                  setRejectReason("");
                }}
              >
                Close
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-rose-500 text-white"
                onClick={async () => {
                  if (!rejectReason.trim()) {
                    setError("Please provide a rejection reason.");
                    return;
                  }
                  await updateStatus(rejectTarget.id, "REJECTED", rejectReason.trim());
                  setRejectTarget(null);
                  setRejectReason("");
                }}
              >
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
