import { useState, useEffect, useCallback } from 'react';
import { resourceService } from '../api/resourceService';

export const useResources = (initialFilters = {}) => {
    const [resources, setResources] = useState([]);
    const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);

    const fetchResources = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await resourceService.getAllResources(filters);
            setResources(data.content || []);
            setPagination({
                page: data.number,
                size: data.size,
                totalElements: data.totalElements,
                totalPages: data.totalPages
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchResources();
    }, [fetchResources]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters, page: 0 })); // Reset to page 0 on new filter
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    return {
        resources,
        pagination,
        loading,
        error,
        filters,
        handleFilterChange,
        handlePageChange,
        refetch: fetchResources
    };
};
