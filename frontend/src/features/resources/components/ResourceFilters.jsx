import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const ResourceFilters = ({ filters, onFilterChange, types, statuses }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    return (
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm flex flex-col md:flex-row flex-wrap gap-3 items-end mb-6">
            {/* Keyword */}
            <div className="flex-1 min-w-[220px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide" htmlFor="keyword">
                    Search
                </label>
                <div className="relative">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                        type="text"
                        name="keyword"
                        id="keyword"
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-blue-100 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                        placeholder="Search by name, code, or location..."
                        value={filters.keyword || ''}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {/* Type */}
            <div className="w-full md:w-44">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide" htmlFor="type">
                    Type
                </label>
                <select
                    id="type" name="type"
                    className="w-full py-2.5 px-3 rounded-xl border border-blue-100 bg-white text-sm text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={filters.type || ''}
                    onChange={handleChange}
                >
                    <option value="">All Types</option>
                    {types.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                </select>
            </div>

            {/* Status */}
            <div className="w-full md:w-44">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide" htmlFor="status">
                    Status
                </label>
                <select
                    id="status" name="status"
                    className="w-full py-2.5 px-3 rounded-xl border border-blue-100 bg-white text-sm text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={filters.status || ''}
                    onChange={handleChange}
                >
                    <option value="">All Statuses</option>
                    {statuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                </select>
            </div>

            {/* Min Capacity */}
            <div className="w-full md:w-32">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide" htmlFor="minCapacity">
                    Min Capacity
                </label>
                <input
                    type="number" name="minCapacity" id="minCapacity" min="0"
                    className="w-full py-2.5 px-3 rounded-xl border border-blue-100 bg-white text-sm text-slate-800 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    value={filters.minCapacity || 0}
                    onChange={handleChange}
                />
            </div>

            {/* Clear */}
            <button
                onClick={() => onFilterChange({ keyword: '', type: '', status: '', minCapacity: 0 })}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-blue-100 bg-blue-50 text-slate-700 text-sm font-medium hover:bg-blue-100 transition"
            >
                <FiX size={14} /> Clear
            </button>
        </div>
    );
};

export default ResourceFilters;
