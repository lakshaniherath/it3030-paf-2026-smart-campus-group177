import React from 'react';
import { useResources } from '../hooks/useResources';
import ResourceFilters from '../components/ResourceFilters';
import ResourceList from '../components/ResourceList';
import { useNavigate } from 'react-router-dom';

const ResourcesCatalogPage = () => {
    const navigate = useNavigate();
    const { resources, loading, error, filters, handleFilterChange } = useResources();

    const handleResourceClick = (id) => {
        navigate(`/resources/${id}`);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-primary tracking-tight">Campus Facilities Catalog</h1>
                <p className="mt-2 text-text-secondary max-w-2xl text-base">
                    Discover, search, and review all bookable campus spaces and equipment in real-time.
                </p>
            </div>

            <ResourceFilters 
                filters={filters} 
                onFilterChange={handleFilterChange} 
                types={['LECTURE_HALL', 'LAB', 'MEETING_ROOM', 'EQUIPMENT']} 
                statuses={['ACTIVE', 'OUT_OF_SERVICE', 'INACTIVE']} 
            />

            {error && (
                <div className="bg-status-dangerBg border border-status-danger/20 rounded-xl p-4 mb-8 flex items-start">
                    <div className="ml-3">
                        <h3 className="text-sm font-semibold text-status-danger">Failed to load resources</h3>
                        <p className="text-sm text-status-danger mt-1 opacity-90">{error}</p>
                    </div>
                </div>
            )}

            <div className="flex-1 pb-10">
                <ResourceList 
                    resources={resources} 
                    loading={loading} 
                    onResourceClick={handleResourceClick} 
                />
            </div>
        </div>
    );
};

export default ResourcesCatalogPage;
