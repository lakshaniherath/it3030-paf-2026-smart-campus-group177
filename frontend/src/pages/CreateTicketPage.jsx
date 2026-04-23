import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicketJson } from '../api/ticketApi';

const CreateTicketPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [errors, setErrors] = useState({});
    
    // මම මෙතන 'resource' වෙනුවට 'resourceId' ලෙසම වෙනස් කළා Backend එකට ගැලපෙන්න
    const [ticketData, setTicketData] = useState({
        resourceId: '', 
        description: '',
        category: '',
        priority: 'MEDIUM',
        reportedBy: '',
        contactDetails: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'description' && value.length > 500) return;

        setTicketData({ ...ticketData, [name]: value });
        
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
            setErrors({ ...errors, images: null });
        }
    };

    const validateForm = () => {
        let newErrors = {};

        // 1. resourceId Validation (name එක resourceId ලෙස වෙනස් විය යුතුයි)
        if (!ticketData.resourceId.trim()) newErrors.resourceId = "Resource/Location is required";

        if (!ticketData.category) newErrors.category = "Please select a category";

        if (ticketData.description.trim().length < 10) {
            newErrors.description = "Please provide more details (at least 10 characters)";
        }

        const idRegex = /^[A-Z]{2}\d+/i; 
        if (!ticketData.reportedBy.trim()) {
            newErrors.reportedBy = "User ID is required";
        } else if (!idRegex.test(ticketData.reportedBy)) {
            newErrors.reportedBy = "Invalid ID format (e.g., IT23XXXXXX)";
        }

        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!ticketData.contactDetails.trim()) {
            newErrors.contactDetails = "Contact details are required";
        } else if (!phoneRegex.test(ticketData.contactDetails) && !emailRegex.test(ticketData.contactDetails)) {
            newErrors.contactDetails = "Provide a valid 10-digit phone number or email";
        }

        if (selectedImages.length > 3) {
            newErrors.images = "Maximum 3 images allowed";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            // මෙතනදී දැන් කෙලින්ම නිවැරදි object එක යනවා
            await createTicketJson(ticketData, selectedImages);
            alert("Ticket Created Successfully! ✅");
            navigate('/'); 
        } catch (error) {
            console.error("Submission Error:", error);
            // 500 error එකක් ආවොත් ඒක backend එකේ අවුලක් බව පෙන්වන්න
            alert("Submission failed. (Backend Error 500). Please check if your database is connected.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] py-12 px-4 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-[32px] shadow-sm border border-slate-100 p-10">
                <div className="mb-8 text-left">
                    <h1 className="text-3xl font-bold text-slate-800">Submit a Request</h1>
                    <p className="text-slate-500 mt-2">Provide precise details to help our technical team.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Resource / Location */}
                    <div className="text-left">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Resource / Location ID *</label>
                        {/* name property එක 'resourceId' ලෙස වෙනස් කළා */}
                        <input type="text" name="resourceId" placeholder="e.g. Lab F401 / PC-05"
                            className={`w-full bg-slate-50 border p-4 rounded-2xl outline-none transition-all ${errors.resourceId ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-200 focus:ring-4 focus:ring-blue-50'}`} 
                            onChange={handleChange} value={ticketData.resourceId} />
                        {errors.resourceId && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.resourceId}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Category *</label>
                            <select name="category" 
                                className={`w-full bg-slate-50 border p-4 rounded-2xl outline-none appearance-none ${errors.category ? 'border-red-400' : 'border-slate-200'}`} 
                                onChange={handleChange} value={ticketData.category}>
                                <option value="">Select Category</option>
                                <option value="EQUIPMENT">Equipment</option>
                                <option value="ELECTRICAL">Electrical</option>
                                <option value="NETWORK">Network / Wi-Fi</option>
                                <option value="PLUMBING">Plumbing</option>
                                <option value="OTHER">Other</option>
                            </select>
                            {errors.category && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.category}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Priority</label>
                            <select name="priority" className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none" onChange={handleChange} value={ticketData.priority}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="text-left">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-bold text-slate-700">Issue Description *</label>
                            <span className={`text-xs font-medium ${ticketData.description.length > 450 ? 'text-red-500' : 'text-slate-400'}`}>
                                {ticketData.description.length} / 500
                            </span>
                        </div>
                        <textarea name="description" placeholder="Describe the problem in detail..."
                            className={`w-full bg-slate-50 border p-4 rounded-2xl h-32 outline-none transition-all ${errors.description ? 'border-red-400 ring-1 ring-red-100' : 'border-slate-200 focus:ring-4 focus:ring-blue-50'}`} 
                            onChange={handleChange} value={ticketData.description}></textarea>
                        {errors.description && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Your ID (Student/Staff) *</label>
                            <input type="text" name="reportedBy" placeholder="e.g. IT23XXXXXX"
                                className={`w-full bg-slate-50 border p-4 rounded-2xl outline-none ${errors.reportedBy ? 'border-red-400' : 'border-slate-200'}`} onChange={handleChange} value={ticketData.reportedBy} />
                            {errors.reportedBy && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.reportedBy}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Contact Number / Email *</label>
                            <input type="text" name="contactDetails" placeholder="07XXXXXXXX"
                                className={`w-full bg-slate-50 border p-4 rounded-2xl outline-none ${errors.contactDetails ? 'border-red-400' : 'border-slate-200'}`} onChange={handleChange} value={ticketData.contactDetails} />
                            {errors.contactDetails && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.contactDetails}</p>}
                        </div>
                    </div>

                    <div className="text-left">
                        <label className="block text-sm font-bold text-slate-700 mb-2 text-left">Evidence Images (Optional - Max 3)</label>
                        <div className={`relative border-2 border-dashed rounded-2xl p-6 transition-all ${errors.images ? 'border-red-300 bg-red-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'}`}>
                            <input type="file" multiple accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} />
                            <div className="text-center">
                                <p className="text-sm text-slate-500">
                                    {selectedImages.length > 0 ? `${selectedImages.length} images selected` : "Drag and drop or click to upload"}
                                </p>
                            </div>
                        </div>
                        {errors.images && <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.images}</p>}
                    </div>

                    <button type="submit" disabled={loading}
                        className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all ${loading ? 'bg-slate-300' : 'bg-blue-600 hover:bg-blue-700 active:scale-95 shadow-blue-100'}`}>
                        {loading ? "Submitting Request..." : "Submit Ticket"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketPage;