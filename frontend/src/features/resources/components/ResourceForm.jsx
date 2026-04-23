import React, { useState, useEffect } from 'react';

const ResourceForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        type: 'LECTURE_HALL',
        capacity: 0,
        location: '',
        status: 'ACTIVE',
        description: '',
        imageUrl: '',
        availabilityWindow: {
            startTime: '08:00',
            endTime: '18:00',
            availableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']
        }
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData
            }));
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleWindowChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            availabilityWindow: {
                ...prev.availabilityWindow,
                [name]: value
            }
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-surface p-6 rounded-2xl shadow-sm border border-bordercolor">
            <h3 className="text-xl font-bold border-b pb-4 mb-4">Resource Primary Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Resource Name *</label>
                    <input 
                        type="text" 
                        name="name" 
                        required 
                        value={formData.name} 
                        onChange={handleChange}
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Code / Identifier</label>
                    <input 
                        type="text" 
                        name="code" 
                        value={formData.code} 
                        onChange={handleChange}
                        placeholder="Leave blank for auto-generation"
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5 bg-background"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Resource Type *</label>
                    <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange}
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5"
                    >
                        <option value="LECTURE_HALL">Lecture Hall</option>
                        <option value="LAB">Lab</option>
                        <option value="MEETING_ROOM">Meeting Room</option>
                        <option value="EQUIPMENT">Equipment</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Capacity *</label>
                    <input 
                        type="number" 
                        name="capacity" 
                        min="0"
                        required 
                        value={formData.capacity} 
                        onChange={handleChange}
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Location *</label>
                    <input 
                        type="text" 
                        name="location" 
                        required 
                        value={formData.location} 
                        onChange={handleChange}
                        placeholder="E.g., Building A, Floor 1"
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5"
                    />
                </div>
            </div>

            <h3 className="text-xl font-bold border-b pb-4 mb-4 mt-8">Media & Availability</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Image URL</label>
                    <input 
                        type="url" 
                        name="imageUrl" 
                        value={formData.imageUrl} 
                        onChange={handleChange}
                        placeholder="https://..."
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Description</label>
                    <textarea 
                        name="description" 
                        rows={3}
                        value={formData.description} 
                        onChange={handleChange}
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Availability Start Time</label>
                    <input 
                        type="time" 
                        name="startTime" 
                        value={formData.availabilityWindow.startTime} 
                        onChange={handleWindowChange}
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text-primary mb-1">Availability End Time</label>
                    <input 
                        type="time" 
                        name="endTime" 
                        value={formData.availabilityWindow.endTime} 
                        onChange={handleWindowChange}
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-text-primary mb-1">Operational Status *</label>
                    <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange}
                        className="block w-full rounded-lg border-bordercolor shadow-sm focus:border-primary focus:ring focus:ring-primary/20 sm:text-sm border p-2.5"
                    >
                        <option value="ACTIVE">Active</option>
                        <option value="OUT_OF_SERVICE">Out of Service</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>
            </div>
            
            <div className="flex justify-end pt-6 mt-6 space-x-3 border-t border-bordercolor">
                <button 
                    type="button" 
                    onClick={onCancel}
                    className="bg-surface py-2.5 px-5 border border-bordercolor rounded-lg shadow-sm text-sm font-bold text-text-secondary hover:bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="inline-flex justify-center py-2.5 px-5 border border-transparent shadow-sm text-sm font-bold rounded-lg text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
                >
                    {isSubmitting ? 'Saving changes...' : 'Save Resource'}
                </button>
            </div>
        </form>
    );
};

export default ResourceForm;
