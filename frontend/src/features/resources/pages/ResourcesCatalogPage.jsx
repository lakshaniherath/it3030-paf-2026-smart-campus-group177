import React from 'react';
import { useResources } from '../hooks/useResources';
import ResourceFilters from '../components/ResourceFilters';
import ResourceList from '../components/ResourceList';
import { useNavigate } from 'react-router-dom';
import { FiGrid, FiLogOut, FiRefreshCw, FiArrowLeft, FiHome, FiCalendar, FiTool, FiSettings } from 'react-icons/fi';

const NAV = [
    { label: 'All Resources',    icon: <FiGrid />,     path: '/resources' },
    { label: 'My Bookings',      icon: <FiCalendar />, path: '/bookings' },
    { label: 'Report Incident',  icon: <FiTool />,     path: '/tickets/create' },
    { label: 'My Tickets',       icon: <FiTool />,     path: '/tickets' },
    { label: 'Admin Resources',  icon: <FiSettings />, path: '/admin/resources' },
    { label: 'Dashboard',        icon: <FiHome />,     path: '/dashboard' },
];

const ResourcesCatalogPage = () => {
    const navigate = useNavigate();
    const { resources, loading, error, filters, handleFilterChange, refetch } = useResources();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-blue-800 via-blue-700 to-cyan-700 px-4 py-6 hidden md:flex flex-col flex-shrink-0">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-black text-sm shadow flex-shrink-0">SC</div>
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">Facilities Catalog</p>
                        <p className="text-blue-200 text-xs">Member 1</p>
                    </div>
                </div>
                <nav className="space-y-2 flex-1">
                    {NAV.map(item => (
                        <button key={item.path} onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition text-sm ${
                                item.path === '/resources'
                                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-semibold'
                                    : 'bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300'
                            }`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
                <button onClick={() => navigate('/dashboard')}
                    className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-blue-100 hover:bg-white/20 transition text-sm">
                    <FiLogOut /> Logout to Dashboard
                </button>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="px-4 md:px-8 py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => navigate('/dashboard')}
                                className="flex items-center justify-center h-9 w-9 rounded-xl border border-blue-100 bg-blue-50 text-slate-600 hover:bg-blue-100 hover:text-blue-700 transition md:hidden">
                                <FiArrowLeft size={16} />
                            </button>
                            <div>
                                <h1 className="text-xl font-bold text-blue-900 leading-tight">Campus Facilities Catalog</h1>
                                <p className="text-xs text-slate-500">Browse and book campus spaces & equipment</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={refetch}
                                className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-cyan-50 transition flex items-center gap-2 text-slate-700 text-sm">
                                <FiRefreshCw size={14} /> Refresh
                            </button>
                            <button onClick={() => navigate('/dashboard')}
                                className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 hover:bg-cyan-50 transition flex items-center gap-2 text-slate-700 text-sm">
                                <FiLogOut size={14} /> Dashboard
                            </button>
                        </div>
                    </div>
                </header>

                <div className="px-4 md:px-8 py-8">
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <FiGrid className="text-blue-500" size={20} />
                            <h2 className="text-2xl font-bold text-blue-900">All Resources</h2>
                        </div>
                        <p className="text-slate-500 text-sm">
                            {loading ? 'Loading...' : `${resources.length} resource${resources.length !== 1 ? 's' : ''} available`}
                        </p>
                    </div>

                    <ResourceFilters filters={filters} onFilterChange={handleFilterChange}
                        types={['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']}
                        statuses={['ACTIVE', 'OUT_OF_SERVICE', 'INACTIVE']} />

                    {error && (
                        <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">
                            Failed to load resources: {error}
                        </div>
                    )}

                    <ResourceList resources={resources} loading={loading}
                        onResourceClick={(id) => navigate(`/resources/${id}`)} />
                </div>
            </div>
        </div>
    );
};

export default ResourcesCatalogPage;
