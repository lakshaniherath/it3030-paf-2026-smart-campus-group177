import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicketJson } from '../api/ticketApi';
import axios from 'axios';
import {
    FiArrowLeft, FiAlertTriangle, FiMapPin, FiUser,
    FiPhone, FiImage, FiSend, FiHome, FiCalendar,
    FiGrid, FiTool, FiLogOut, FiPlusCircle,
} from 'react-icons/fi';

const NAV = [
    { label: 'All Tickets',     icon: <FiTool />,       path: '/tickets' },
    { label: 'Report Incident', icon: <FiPlusCircle />,  path: '/tickets/create', active: true },
    { label: 'My Bookings',     icon: <FiCalendar />,   path: '/bookings' },
    { label: 'Resources',       icon: <FiGrid />,       path: '/resources' },
    { label: 'Dashboard',       icon: <FiHome />,       path: '/dashboard' },
];

const CreateTicketPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [errors, setErrors] = useState({});
    const [resources, setResources] = useState([]);
    const [filteredResources, setFilteredResources] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [ticketData, setTicketData] = useState({
        resourceId: '',
        description: '',
        category: '',
        priority: 'MEDIUM',
        reportedBy: '',
        contactDetails: '',
    });

    // Fetch resources on component mount
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/resources?size=100');
                const resourceList = response.data?.content || [];
                setResources(resourceList);
            } catch (error) {
                console.error('Failed to fetch resources:', error);
            }
        };
        fetchResources();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'description' && value.length > 500) return;
        
        if (name === 'resourceId') {
            // Filter resources based on input
            const filtered = resources.filter(r => 
                r.name.toLowerCase().includes(value.toLowerCase()) ||
                r.id.toLowerCase().includes(value.toLowerCase()) ||
                r.location.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredResources(filtered);
            setShowSuggestions(value.length > 0 && filtered.length > 0);
        }
        
        setTicketData({ ...ticketData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const selectResource = (resource) => {
        setTicketData({ ...ticketData, resourceId: `${resource.name} (${resource.location})` });
        setShowSuggestions(false);
        setErrors({ ...errors, resourceId: null });
    };

    const handleImageChange = (e) => {
        if (e.target.files) {
            setSelectedImages(Array.from(e.target.files));
            setErrors({ ...errors, images: null });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!ticketData.resourceId.trim()) newErrors.resourceId = 'Resource/Location is required';
        if (!ticketData.category) newErrors.category = 'Please select a category';
        if (ticketData.description.trim().length < 10)
            newErrors.description = 'Please provide more details (at least 10 characters)';
        const idRegex = /^[A-Z]{2}\d+/i;
        if (!ticketData.reportedBy.trim()) newErrors.reportedBy = 'User ID is required';
        else if (!idRegex.test(ticketData.reportedBy)) newErrors.reportedBy = 'Invalid ID format (e.g., IT23XXXXXX)';
        const phoneRegex = /^\d{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!ticketData.contactDetails.trim()) newErrors.contactDetails = 'Contact details are required';
        else if (!phoneRegex.test(ticketData.contactDetails) && !emailRegex.test(ticketData.contactDetails))
            newErrors.contactDetails = 'Provide a valid 10-digit phone or email';
        if (selectedImages.length > 3) newErrors.images = 'Maximum 3 images allowed';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        try {
            await createTicketJson(ticketData, selectedImages);
            navigate('/tickets');
        } catch (error) {
            setErrors({ submit: 'Submission failed. Please check your connection and try again.' });
        } finally {
            setLoading(false);
        }
    };

    const inputCls = (field) =>
        `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
            errors[field]
                ? 'border-rose-300 bg-rose-50 focus:ring-rose-100'
                : 'border-blue-100 bg-white focus:border-blue-300 focus:ring-blue-100'
        }`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50 text-slate-800 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gradient-to-b from-blue-800 via-blue-700 to-cyan-700 px-4 py-6 hidden md:flex flex-col flex-shrink-0">
                <div className="flex items-center gap-3 px-2 mb-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-slate-950 font-black text-sm shadow flex-shrink-0">SC</div>
                    <div>
                        <p className="text-white font-bold text-sm leading-tight">Maintenance</p>
                    </div>
                </div>
                <nav className="space-y-2 flex-1">
                    {NAV.map(item => (
                        <button key={item.path} onClick={() => navigate(item.path)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition text-sm ${
                                item.active
                                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 font-semibold'
                                    : 'bg-white/95 text-blue-900 border-blue-100 hover:border-cyan-300'
                            }`}>
                            {item.icon} {item.label}
                        </button>
                    ))}
                </nav>
                <button onClick={() => navigate('/dashboard')}
                    className="mt-4 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 text-blue-100 hover:bg-white/20 transition text-sm">
                    <FiLogOut /> Back to Dashboard
                </button>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="px-4 md:px-8 py-4 flex items-center gap-3">
                    <button onClick={() => navigate('/tickets')}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700 transition">
                        <FiArrowLeft size={15} /> Back to Tickets
                    </button>
                </div>
            </header>

            <div className="px-4 md:px-8 py-8 max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                        <FiAlertTriangle className="text-amber-500" /> Submit Incident Ticket
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Provide precise details to help our technical team resolve the issue.</p>
                </div>

                {errors.submit && (
                    <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-800 text-sm">{errors.submit}</div>
                )}

                <form onSubmit={handleSubmit} className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm space-y-5">
                    {/* Resource */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                            <FiMapPin className="inline mr-1 text-blue-400" /> Resource / Location ID *
                        </label>
                        <input 
                            type="text" 
                            name="resourceId" 
                            placeholder="Start typing to search resources..."
                            className={inputCls('resourceId')} 
                            onChange={handleChange} 
                            value={ticketData.resourceId}
                            onFocus={() => {
                                if (ticketData.resourceId && filteredResources.length > 0) {
                                    setShowSuggestions(true);
                                }
                            }}
                            onBlur={() => {
                                // Delay to allow click on suggestion
                                setTimeout(() => setShowSuggestions(false), 200);
                            }}
                            autoComplete="off"
                        />
                        {errors.resourceId && <p className="text-rose-500 text-xs mt-1">{errors.resourceId}</p>}
                        
                        {/* Suggestions Dropdown */}
                        {showSuggestions && filteredResources.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-blue-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                                {filteredResources.slice(0, 10).map((resource) => (
                                    <button
                                        key={resource.id}
                                        type="button"
                                        onClick={() => selectResource(resource)}
                                        className="w-full text-left px-4 py-3 hover:bg-blue-50 transition border-b border-blue-50 last:border-b-0"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm text-slate-800 truncate">{resource.name}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">
                                                    📍 {resource.location} • {resource.type?.replace(/_/g, ' ')}
                                                </p>
                                                {resource.capacity && (
                                                    <p className="text-xs text-slate-400 mt-0.5">Capacity: {resource.capacity}</p>
                                                )}
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                                                resource.status === 'ACTIVE' 
                                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                                                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                                            }`}>
                                                {resource.status}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                                {filteredResources.length > 10 && (
                                    <div className="px-4 py-2 text-xs text-slate-400 text-center bg-blue-50">
                                        Showing 10 of {filteredResources.length} results
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Category + Priority */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Category *</label>
                            <select name="category" className={inputCls('category')} onChange={handleChange} value={ticketData.category}>
                                <option value="">Select Category</option>
                                <option value="EQUIPMENT">Equipment</option>
                                <option value="ELECTRICAL">Electrical</option>
                                <option value="NETWORK">Network / Wi-Fi</option>
                                <option value="PLUMBING">Plumbing</option>
                                <option value="OTHER">Other</option>
                            </select>
                            {errors.category && <p className="text-rose-500 text-xs mt-1">{errors.category}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">Priority</label>
                            <select name="priority" className={inputCls('priority')} onChange={handleChange} value={ticketData.priority}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">Issue Description *</label>
                            <span className={`text-xs font-medium ${ticketData.description.length > 450 ? 'text-rose-500' : 'text-slate-400'}`}>
                                {ticketData.description.length} / 500
                            </span>
                        </div>
                        <textarea name="description" placeholder="Describe the problem in detail..."
                            className={`${inputCls('description')} h-28 resize-none`}
                            onChange={handleChange} value={ticketData.description} />
                        {errors.description && <p className="text-rose-500 text-xs mt-1">{errors.description}</p>}
                    </div>

                    {/* Reporter + Contact */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                                <FiUser className="inline mr-1 text-blue-400" /> Your ID *
                            </label>
                            <input type="text" name="reportedBy" placeholder="e.g. IT23XXXXXX"
                                className={inputCls('reportedBy')} onChange={handleChange} value={ticketData.reportedBy} />
                            {errors.reportedBy && <p className="text-rose-500 text-xs mt-1">{errors.reportedBy}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                                <FiPhone className="inline mr-1 text-blue-400" /> Contact *
                            </label>
                            <input type="text" name="contactDetails" placeholder="07XXXXXXXX or email"
                                className={inputCls('contactDetails')} onChange={handleChange} value={ticketData.contactDetails} />
                            {errors.contactDetails && <p className="text-rose-500 text-xs mt-1">{errors.contactDetails}</p>}
                        </div>
                    </div>

                    {/* Images */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
                            <FiImage className="inline mr-1 text-blue-400" /> Evidence Images (Optional — Max 3)
                        </label>
                        <div className={`relative border-2 border-dashed rounded-xl p-5 text-center transition ${
                            errors.images ? 'border-rose-300 bg-rose-50' : 'border-blue-100 bg-blue-50/40 hover:bg-blue-50'
                        }`}>
                            <input type="file" multiple accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleImageChange} />
                            <p className="text-sm text-slate-500">
                                {selectedImages.length > 0
                                    ? `${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} selected`
                                    : 'Click or drag to upload images'}
                            </p>
                        </div>
                        {errors.images && <p className="text-rose-500 text-xs mt-1">{errors.images}</p>}
                    </div>

                    <button type="submit" disabled={loading}
                        className="w-full py-3 rounded-2xl bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-500/20 hover:bg-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                        {loading ? 'Submitting...' : <><FiSend size={15} /> Submit Ticket</>}
                    </button>
                </form>
            </div>
            </div>
        </div>
    );
};

export default CreateTicketPage;
