import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourceService } from '../api/resourceService';
import StatusBadge from '../components/StatusBadge';
import TypeBadge from '../components/TypeBadge';
import { FiArrowLeft, FiClock, FiMapPin, FiUsers, FiInfo, FiCalendar, FiSettings, FiStar } from 'react-icons/fi';
import axios from 'axios';

const ResourceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        resourceService.getResourceById(id)
            .then(setResource)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
        
        // Check if resource is favorited
        checkFavoriteStatus();
    }, [id]);

    const checkFavoriteStatus = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.email) return;
            
            const res = await axios.get(`http://localhost:8080/api/member2/favorites/check/${id}`, {
                headers: { 'X-User-Email': user.email }
            });
            setIsFavorite(res.data?.isFavorite || false);
        } catch (err) {
            console.error('Failed to check favorite status:', err);
        }
    };

    const toggleFavorite = async () => {
        setFavoriteLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.email) {
                alert('Please log in to add favorites');
                return;
            }

            if (isFavorite) {
                await axios.delete(`http://localhost:8080/api/member2/favorites/${id}`, {
                    headers: { 'X-User-Email': user.email }
                });
                setIsFavorite(false);
            } else {
                await axios.post(`http://localhost:8080/api/member2/favorites/${id}`, {}, {
                    headers: { 'X-User-Email': user.email }
                });
                setIsFavorite(true);
            }
        } catch (err) {
            console.error('Failed to toggle favorite:', err);
            alert('Failed to update favorite status');
        } finally {
            setFavoriteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Loading resource...</p>
                </div>
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
                <div className="max-w-md w-full rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-sm">
                    <p className="text-rose-600 font-semibold mb-4">{error || 'Resource not found'}</p>
                    <button
                        onClick={() => navigate('/resources')}
                        className="px-4 py-2 rounded-xl bg-blue-50 border border-blue-100 text-slate-700 hover:bg-blue-100 transition text-sm"
                    >
                        Back to Catalog
                    </button>
                </div>
            </div>
        );
    }

    const imageUrl = resource.imageUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.name)}&background=EFF6FF&color=2563EB&size=800`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800">
            {/* Header */}
            <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 md:px-8 py-4 flex items-center gap-3">
                    <button
                        onClick={() => navigate('/resources')}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700 transition"
                    >
                        <FiArrowLeft size={15} /> Back to Catalog
                    </button>
                </div>
            </header>

            <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
                {/* Hero image */}
                <div className="relative rounded-2xl overflow-hidden border border-blue-100 shadow-sm mb-6 h-64 md:h-80">
                    <img src={imageUrl} alt={resource.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    <div className="absolute top-4 right-4">
                        <StatusBadge status={resource.status} />
                    </div>
                    <div className="absolute bottom-5 left-6 right-6 text-white">
                        <div className="flex items-center gap-2 mb-2">
                            <TypeBadge type={resource.type} />
                            <span className="text-xs font-mono bg-black/30 px-2 py-0.5 rounded-lg border border-white/10">
                                {resource.code}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow">{resource.name}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main info */}
                    <div className="lg:col-span-2 space-y-5">
                        {/* Quick stats */}
                        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm flex flex-wrap gap-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <FiMapPin className="text-blue-500" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Location</p>
                                    <p className="font-semibold text-slate-800">{resource.location}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                                    <FiUsers className="text-cyan-500" size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Capacity</p>
                                    <p className="font-semibold text-slate-800">{resource.capacity} people</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <FiInfo className="text-blue-500" size={16} /> About this Resource
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {resource.description || 'No description provided for this resource.'}
                            </p>
                        </div>

                        {/* Availability */}
                        {resource.availabilityWindow && (
                            <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                                <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                                    <FiClock className="text-blue-500" size={16} /> Operational Hours
                                </h3>
                                <div className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3 border border-blue-100">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-0.5">Standard Availability</p>
                                        <p className="font-bold text-slate-800">
                                            {resource.availabilityWindow.startTime} — {resource.availabilityWindow.endTime}
                                        </p>
                                    </div>
                                    <FiCalendar className="text-blue-300" size={22} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action panel */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm sticky top-24 space-y-3">
                            <h3 className="font-bold text-slate-900 mb-4">Actions</h3>
                            
                            {/* Favorite Button */}
                            <button
                                onClick={toggleFavorite}
                                disabled={favoriteLoading}
                                className={`w-full py-3 rounded-2xl font-semibold transition flex items-center justify-center gap-2 ${
                                    isFavorite
                                        ? 'bg-amber-100 text-amber-700 border-2 border-amber-300 hover:bg-amber-200'
                                        : 'bg-slate-50 text-slate-700 border-2 border-slate-200 hover:bg-slate-100'
                                }`}
                            >
                                <FiStar size={16} fill={isFavorite ? 'currentColor' : 'none'} />
                                {favoriteLoading ? 'Updating...' : isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                            </button>

                            <button
                                onClick={() => navigate(`/bookings?resourceId=${resource.id}`)}
                                disabled={resource.status !== 'ACTIVE'}
                                className="w-full py-3 rounded-2xl bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <FiCalendar size={15} /> Book this Resource
                            </button>
                            {resource.status !== 'ACTIVE' && (
                                <p className="text-xs text-center text-slate-400">This resource is currently unavailable for booking.</p>
                            )}
                            <div className="pt-3 border-t border-blue-50">
                                <button
                                    onClick={() => navigate('/admin/resources')}
                                    className="w-full py-2.5 rounded-xl border border-blue-100 bg-blue-50 text-slate-700 text-sm font-medium hover:bg-blue-100 transition flex items-center justify-center gap-2"
                                >
                                    <FiSettings size={14} /> Manage in Admin Panel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetailsPage;
