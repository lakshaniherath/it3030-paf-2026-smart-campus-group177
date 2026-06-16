import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tickets';

export const createTicketJson = async (ticketData, selectedImages) => {
    const formData = new FormData();
    formData.append('resourceId', ticketData.resourceId);
    formData.append('description', ticketData.description);
    formData.append('category', ticketData.category);
    formData.append('priority', ticketData.priority);
    formData.append('reportedBy', ticketData.reportedBy);
    formData.append('contactDetails', ticketData.contactDetails);

    if (selectedImages && selectedImages.length > 0) {
        selectedImages.forEach((file) => formData.append('files', file));
    }

    const response = await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getAllTickets = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const deleteTicket = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const updateTicketStatus = async (id, status) => {
    const response = await axios.patch(`${API_URL}/${id}/status`, status, {
        headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
};
