import React from 'react';
import ResourceCard from './ResourceCard';
import { SearchX } from 'lucide-react';

const ResourceList = ({ resources, loading, onResourceClick }) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="bg-surface border border-bordercolor h-[360px] rounded-2xl shadow-sm overflow-hidden animate-pulse">
                        <div className="h-48 bg-gray-200 w-full" />
                        <div className="p-5">
                            <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
                            <div className="h-6 w-full bg-gray-200 rounded mb-4" />
                            <div className="h-4 w-2/3 bg-gray-200 rounded mb-2" />
                            <div className="h-4 w-1/2 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!resources || resources.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-surface rounded-2xl shadow-sm border border-bordercolor text-center">
                <div className="bg-status-inactiveBg p-6 rounded-full mb-6">
                    <SearchX className="w-16 h-16 text-text-secondary opacity-50" />
                </div>
                <h3 className="text-2xl font-bold text-text-primary mb-2">No Resources Found</h3>
                <p className="text-text-secondary max-w-md text-lg">We couldn't find anything matching your current filters. Try adjusting your search criteria.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resources.map(resource => (
                <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    onClick={onResourceClick} 
                />
            ))}
        </div>
    );
};

export default ResourceList;
