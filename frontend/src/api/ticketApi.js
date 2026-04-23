import axios from 'axios';

// Backend URL එක (Vite Proxy එකක් නැතිනම් කෙලින්ම Localhost පාවිච්චි වේ)
const API_URL = 'http://localhost:8080/api/tickets';

/**
 * අලුත් ටිකට් එකක් සෑදීම (පින්තූර සහිතව)
 */
export const createTicketJson = async (ticketData, selectedImages) => {
    const formData = new FormData();
    
    // වැදගත්: Frontend එකේ 'resource' අගය Backend එකේ බලාපොරොත්තු වන 'resourceId' නමට මෙතැනදී Map කෙරේ.
    formData.append('resourceId', ticketData.resource); 
    formData.append('description', ticketData.description);
    formData.append('category', ticketData.category);
    formData.append('priority', ticketData.priority);
    formData.append('reportedBy', ticketData.reportedBy);
    formData.append('contactDetails', ticketData.contactDetails);

    // පින්තූර තිබේ නම් ඒවා 'files' ලෙස FormData එකට එකතු කිරීම
    if (selectedImages && selectedImages.length > 0) {
        selectedImages.forEach((file) => {
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
        // Error එක හරියටම Console එකේ බලාගැනීමට මෙය උපකාරී වේ
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
 * ටිකට් එකක Status එක වෙනස් කිරීම
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