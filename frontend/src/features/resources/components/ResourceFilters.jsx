import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const ResourceFilters = ({ filters, onFilterChange, types, statuses }) => {
    const [localKeyword, setLocalKeyword] = useState(filters.keyword || '');

    // Debounce the keyword search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localKeyword !== filters.keyword) {
                onFilterChange({ keyword: localKeyword });
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [localKeyword]);

    // Sync local state when filters change externally
    useEffect(() => {
        setLocalKeyword(filters.keyword || '');
    }, [filters.keyword]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    const handleClear = () => {
        setLocalKeyword('');
        onFilterChange({ keyword: '', type: '', status: '', minCapacity: 0 });
    };

    const hasActiveFilters = filters.keyword || filters.type || filters.status || filters.minCapacity;

    return (
        <div className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm flex flex-col md:flex-row flex-wrap gap-3 items-end mb-6">
            {/* Keyword */}
            <div className="flex-1 min-w-[220px]">
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide" htmlFor="keyword">
                    Search
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                        type="text"
                        name="keyword"
                        id="keyword"
                        className="focus:ring-2 focus:ring-primary focus:border-primary block w-full pl-10 pr-10 text-sm border-bordercolor rounded-lg py-2.5 border"
                        placeholder="Search by name, code, or location..."
                        value={localKeyword}
                        onChange={(e) => setLocalKeyword(e.target.value)}
                    />
                    {localKeyword && (
                        <button
                            type="button"
                            onClick={() => { setLocalKeyword(''); onFilterChange({ keyword: '' }); }}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <X className="h-4 w-4 text-text-secondary hover:text-text-primary" />
                        </button>
                    )}
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
                    type="number"
                    name="minCapacity"
                    id="minCapacity"
                    className="focus:ring-2 focus:ring-primary focus:border-primary block w-full text-sm border-bordercolor rounded-lg py-2.5 px-3 border"
                    value={filters.minCapacity || ''}
                    onChange={handleChange}
                    min="0"
                    placeholder="Any"
                />
            </div>
            
            <button 
                onClick={handleClear}
                disabled={!hasActiveFilters}
                className={`w-full md:w-auto px-5 py-2.5 border shadow-sm text-sm font-semibold rounded-lg focus:outline-none transition-colors flex items-center gap-1.5 ${
                    hasActiveFilters 
                        ? 'border-bordercolor text-text-primary bg-background hover:bg-gray-100' 
                        : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                }`}
            >
                <X size={14} /> Clear
            </button>
        </div>
    );
};

export default ResourceFilters;
