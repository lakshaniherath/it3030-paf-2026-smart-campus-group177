import React from 'react';
import ResourceCard from './ResourceCard';
import { FiSearch } from 'react-icons/fi';

const ResourceList = ({ resources, loading, onResourceClick }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="bg-white border border-blue-100 rounded-2xl overflow-hidden animate-pulse shadow-sm">
                        <div className="h-44 bg-blue-50" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 w-20 bg-blue-50 rounded-lg" />
                            <div className="h-5 w-3/4 bg-blue-50 rounded-lg" />
                            <div className="h-3.5 w-2/3 bg-blue-50 rounded-lg" />
                            <div className="h-3.5 w-1/2 bg-blue-50 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!resources || resources.length === 0) {
        return (
            <div className="rounded-2xl border border-blue-100 bg-white p-16 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                    <FiSearch className="text-blue-300" size={28} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Resources Found</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    We couldn't find anything matching your current filters. Try adjusting your search criteria.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {resources.map(resource => (
                <ResourceCard key={resource.id} resource={resource} onClick={onResourceClick} />
            ))}
        </div>
    );
};

export default ResourceList;
