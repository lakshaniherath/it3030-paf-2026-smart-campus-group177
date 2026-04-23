import { useState, useEffect, useCallback, useRef } from 'react';
import { resourceService } from '../api/resourceService';

export const useResources = (initialFilters = {}) => {
    const [resources, setResources] = useState([]);
    const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState(initialFilters);
    const debounceRef = useRef(null);

    const fetchResources = useCallback(async (currentFilters) => {
        setLoading(true);
        setError(null);
        try {
            const data = await resourceService.getAllResources(currentFilters);
            setResources(data.content || []);
            setPagination({
                page: data.number,
                size: data.size,
                totalElements: data.totalElements,
                totalPages: data.totalPages
            });
        } catch (err) {
            setError(err.message);
            setResources([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Debounced filter effect
    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }
        
        debounceRef.current = setTimeout(() => {
            fetchResources(filters);
        }, 300); // 300ms debounce

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [filters, fetchResources]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => {
            // Only reset page if filters actually changed
            const hasChanged = Object.keys(newFilters).some(key => prev[key] !== newFilters[key]);
            return hasChanged ? { ...prev, ...newFilters, page: 0 } : prev;
        });
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const clearFilters = () => {
        setFilters({ page: 0, size: 10 });
    };

    return {
        resources,
        pagination,
        loading,
        error,
        filters,
        handleFilterChange,
        handlePageChange,
        clearFilters,
        refetch: () => fetchResources(filters)
    };
};
