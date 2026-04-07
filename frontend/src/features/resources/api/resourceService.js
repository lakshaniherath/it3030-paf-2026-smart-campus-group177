import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/resources';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response interceptor for generic error handling
apiClient.interceptors.response.use(
    response => response.data,
    error => {
        const message = error.response?.data?.message || error.message || 'API Request Failed';
        return Promise.reject(new Error(message));
    }
);

export const resourceService = {
    getAllResources: (filters = {}) => {
        const params = {};
        if (filters.keyword) params.keyword = filters.keyword;
        if (filters.type) params.type = filters.type;
        if (filters.status) params.status = filters.status;
        if (filters.minCapacity) params.minCapacity = filters.minCapacity;
        if (filters.page !== undefined) params.page = filters.page;
        if (filters.size !== undefined) params.size = filters.size;

        return apiClient.get('', { params });
    },

    getResourceById: (id) => apiClient.get(`/${id}`),

    createResource: (resourceData) => apiClient.post('', resourceData),

    updateResource: (id, resourceData) => apiClient.put(`/${id}`, resourceData),

    updateResourceStatus: (id, status) => apiClient.patch(`/${id}/status`, { status }),

    deleteResource: (id) => apiClient.delete(`/${id}`)
};
