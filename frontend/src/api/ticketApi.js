import axios from 'axios';

// Vite proxy එක හරහා යන නිසා '/api/tickets' ලෙස භාවිතා කළ හැක
const API_URL = 'http://localhost:8080/api/tickets';

/**
 * අලුත් ටිකට් එකක් සෑදීම (පින්තූර සහිතව)
 * @param {Object} ticketData - ටිකට් එකේ විස්තර
 * @param {Array} selectedImages - Browser එකෙන් තෝරාගත් File objects ලිස්ට් එක
 */
export const createTicketJson = async (ticketData, selectedImages) => {
    const formData = new FormData();
    
    // ටිකට් එකේ මූලික දත්ත FormData එකට එකතු කිරීම
    formData.append('resourceId', ticketData.resourceId);
    formData.append('description', ticketData.description);
    formData.append('category', ticketData.category);
    formData.append('priority', ticketData.priority);
    formData.append('reportedBy', ticketData.reportedBy);
    formData.append('contactDetails', ticketData.contactDetails);

    // පින්තූර තිබේ නම් ඒවා 'files' ලෙස FormData එකට එකතු කිරීම
    if (selectedImages && selectedImages.length > 0) {
        selectedImages.forEach((file) => {
            // Web වලදී කෙලින්ම file object එක append කළ යුතුය
            formData.append('files', file); 
        });
    }

    try {
        const response = await axios.post(API_URL, formData, {
            headers: { 
                'Content-Type': 'multipart/form-data' 
            },
        });
        return response.data;
    } catch (error) {
        console.error("API Error (Create):", error.response?.data || error.message);
        throw error;
    }
};

/**
 * සියලුම ටිකට් ලබා ගැනීම
 */
export const getAllTickets = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error("API Error (Fetch All):", error);
        throw error;
    }
};

/**
 * ටිකට් එකක් මකා දැමීම
 */
export const deleteTicket = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error("API Error (Delete):", error);
        throw error;
    }
};

/**
 * ටිකට් එකක Status එක (OPEN, IN_PROGRESS, etc.) වෙනස් කිරීම
 */
export const updateTicketStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/${id}/status`, status, {
            headers: { 'Content-Type': 'text/plain' }
        });
        return response.data;
    } catch (error) {
        console.error("API Error (Update Status):", error);
        throw error;
    }
};