import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiStar, FiCalendar, FiMapPin, FiUsers, FiClock, FiTrendingUp } from 'react-icons/fi';
import bookingApi from './bookingApi';
import axios from 'axios';

const FavoritesPanel = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [resources, setResources] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch user's favorite resource IDs
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.email) {
        setError('Please log in to view favorites');
        setLoading(false);
        return;
      }

      const favRes = await bookingApi.get('/api/member2/favorites');
      const favoriteIds = favRes.data || [];
      setFavorites(favoriteIds);

      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch all resources
      const resourceRes = await axios.get('http://localhost:8080/api/resources?size=100');
      const allResources = resourceRes.data?.content || [];
      
      // Filter to only favorite resources
      const favoriteResources = allResources.filter(r => favoriteIds.includes(r.id));
      setResources(favoriteResources);

      // Fetch user's bookings
      const bookingRes = await bookingApi.get('/api/member2/bookings');
      setBookings(bookingRes.data || []);
    } catch (err) {
      console.error('Error loading favorites:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Unknown error';
      setError('Failed to load favorites: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (resourceId) => {
    try {
      await bookingApi.delete(`/api/member2/favorites/${resourceId}`);
      setFavorites(prev => prev.filter(id => id !== resourceId));
      setResources(prev => prev.filter(r => r.id !== resourceId));
    } catch (err) {
      setError('Failed to remove favorite: ' + (err.message || 'Unknown error'));
    }
  };

  const getBookingHistory = (resourceId) => {
    return bookings.filter(b => b.resourceId === resourceId);
  };

  const getBookingStats = (resourceId) => {
    const history = getBookingHistory(resourceId);
    const approved = history.filter(b => b.status === 'APPROVED').length;
    const pending = history.filter(b => b.status === 'PENDING').length;
    const total = history.length;
    return { total, approved, pending };
  };

  const quickBook = (resourceId) => {
    navigate(`/bookings?resourceId=${resourceId}`);
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
        <p className="text-slate-600 text-sm">Loading favorites...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm">
        <p className="text-rose-800 text-sm">{error}</p>
      </section>
    );
  }

  if (favorites.length === 0) {
    return (
      <section className="rounded-2xl border border-blue-100 bg-white p-12 shadow-sm text-center">
        <FiStar className="mx-auto text-slate-300 mb-4" size={48} />
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Favorite Resources Yet</h3>
        <p className="text-slate-600 mb-6">
          Mark resources as favorites for quick access and booking history tracking.
        </p>
        <button
          onClick={() => navigate('/resources')}
          className="px-6 py-3 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition"
        >
          Browse Resources
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <FiStar className="text-amber-500" />
            My Favorite Resources
          </h2>
          <span className="text-sm text-slate-500">{favorites.length} favorite{favorites.length !== 1 ? 's' : ''}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {resources.map(resource => {
          const stats = getBookingStats(resource.id);
          const history = getBookingHistory(resource.id);
          const recentBookings = history.slice(0, 3);

          return (
            <div
              key={resource.id}
              className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{resource.name}</h3>
                    <button
                      onClick={() => removeFavorite(resource.id)}
                      className="p-1 rounded-lg hover:bg-rose-50 text-amber-500 hover:text-rose-500 transition"
                      title="Remove from favorites"
                    >
                      <FiStar size={18} fill="currentColor" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 font-mono">{resource.code}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  resource.status === 'ACTIVE' 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {resource.status}
                </span>
              </div>

              {/* Resource Info */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FiMapPin size={14} className="text-blue-500" />
                  <span className="truncate">{resource.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <FiUsers size={14} className="text-emerald-500" />
                  <span>Cap: {resource.capacity}</span>
                </div>
              </div>

              {/* Booking Stats */}
              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-3 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiTrendingUp size={14} className="text-blue-600" />
                  <span className="text-xs font-semibold text-slate-700">Your Booking History</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                    <p className="text-xs text-slate-500">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">{stats.approved}</p>
                    <p className="text-xs text-slate-500">Approved</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                    <p className="text-xs text-slate-500">Pending</p>
                  </div>
                </div>
              </div>

              {/* Recent Bookings */}
              {recentBookings.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                    Recent Bookings
                  </p>
                  <div className="space-y-1.5">
                    {recentBookings.map(booking => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between text-xs bg-slate-50 rounded-lg px-3 py-2 border border-slate-100"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FiClock size={10} className="text-slate-400 flex-shrink-0" />
                          <span className="text-slate-600 truncate">{booking.bookingDate}</span>
                          <span className="text-slate-400">{booking.startTime}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${
                          booking.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-700' :
                          booking.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                          booking.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => quickBook(resource.id)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition flex items-center justify-center gap-2"
                >
                  <FiCalendar size={14} />
                  Quick Book
                </button>
                <button
                  onClick={() => navigate(`/resources/${resource.id}`)}
                  className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 font-semibold hover:bg-blue-100 transition"
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </section>
  );
};

export default FavoritesPanel;
