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
        <div className="bg-surface p-5 rounded-2xl shadow-sm border border-bordercolor flex flex-col md:flex-row flex-wrap gap-4 items-end mb-8">
            <div className="flex-1 min-w-[240px]">
                <label className="block text-sm font-semibold text-text-primary mb-1.5" htmlFor="keyword">Resource Keyword</label>
                <div className="relative rounded-lg shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-text-secondary opacity-70" />
                    </div>
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

            <div className="w-full md:w-48">
                <label className="block text-sm font-semibold text-text-primary mb-1.5" htmlFor="type">Resource Type</label>
                <select
                    id="type"
                    name="type"
                    className="block w-full py-2.5 px-3 text-sm border-bordercolor focus:outline-none focus:ring-2 focus:ring-primary rounded-lg border bg-surface"
                    value={filters.type || ''}
                    onChange={handleChange}
                >
                    <option value="">All Types</option>
                    {types.map(t => (
                        <option key={t} value={t}>{t.replace('_', ' ')}</option>
                    ))}
                </select>
            </div>

            <div className="w-full md:w-48">
                <label className="block text-sm font-semibold text-text-primary mb-1.5" htmlFor="status">Status</label>
                <select
                    id="status"
                    name="status"
                    className="block w-full py-2.5 px-3 text-sm border-bordercolor focus:outline-none focus:ring-2 focus:ring-primary rounded-lg border bg-surface"
                    value={filters.status || ''}
                    onChange={handleChange}
                >
                    <option value="">All Statuses</option>
                    {statuses.map(s => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                    ))}
                </select>
            </div>

            <div className="w-full md:w-32">
                <label className="block text-sm font-semibold text-text-primary mb-1.5" htmlFor="minCapacity">Min Capacity</label>
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
                className={`w-full md:w-auto px-5 py-2.5 border shadow-sm text-sm font-semibold rounded-lg focus:outline-none transition-colors ${
                    hasActiveFilters 
                        ? 'border-bordercolor text-text-primary bg-background hover:bg-gray-100' 
                        : 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                }`}
            >
                Clear Filters
            </button>
        </div>
    );
};

export default ResourceFilters;
