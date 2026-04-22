import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resourceService } from '../api/resourceService';
import StatusBadge from '../components/StatusBadge';
import TypeBadge from '../components/TypeBadge';
import { ArrowLeft, Clock, MapPin, Users, Info, Calendar } from 'lucide-react';

const ResourceDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResource = async () => {
            if (!id) return;
            try {
                const data = await resourceService.getResourceById(id);
                setResource(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchResource();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20">
                <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <div className="text-text-secondary font-medium">Loading Resource File...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-status-dangerBg border border-status-danger/20 rounded-xl p-8 text-center max-w-2xl mx-auto mt-10">
                <h3 className="text-lg font-bold text-status-danger mb-2">Error Retrieval Failed</h3>
                <p className="text-status-danger mb-6">{error}</p>
                <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-background border border-bordercolor rounded-lg font-semibold text-text-primary shadow-sm hover:bg-gray-50 transition-colors">Return to Catalog</button>
            </div>
        );
    }

    if (!resource) return null;

    const imageUrl = resource.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.name)}&background=F8FAFC&color=2563EB&size=800`;

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <button 
                onClick={() => navigate('/')}
                className="flex items-center text-sm font-semibold text-text-secondary hover:text-primary mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Catalog
            </button>

            <div className="bg-surface rounded-3xl shadow-sm border border-bordercolor overflow-hidden">
                {/* Hero Header Area */}
                <div className="h-64 sm:h-80 lg:h-96 w-full relative bg-background">
                    <img src={imageUrl} alt={resource.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-6 right-6">
                        <StatusBadge status={resource.status} />
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                        <div className="flex items-center space-x-3 mb-3">
                            <TypeBadge type={resource.type} />
                            <span className="text-xs font-mono bg-black/40 px-2 py-1 rounded backdrop-blur-sm border border-white/10">{resource.code}</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-md">{resource.name}</h1>
                    </div>
                </div>
                
                {/* Content Area */}
                <div className="p-8 sm:p-10">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        
                        {/* Main Info Column */}
                        <div className="lg:col-span-2 space-y-10">
                            {/* Quick Stats Bar */}
                            <div className="flex flex-wrap gap-4 sm:gap-8 pb-8 border-b border-bordercolor">
                                <div className="flex items-center">
                                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                                        <MapPin className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">Location</div>
                                        <div className="text-base font-semibold text-text-primary mt-1">{resource.location}</div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="bg-accent/10 p-3 rounded-full mr-4">
                                        <Users className="w-6 h-6 text-accent" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">Capacity</div>
                                        <div className="text-base font-semibold text-text-primary mt-1">{resource.capacity} people</div>
                                    </div>
                                </div>
                            </div>

                            <section>
                                <div className="flex items-center mb-4">
                                    <Info className="w-5 h-5 text-primary mr-2" />
                                    <h3 className="text-xl font-bold text-text-primary">About this Resource</h3>
                                </div>
                                <p className="text-text-secondary leading-relaxed text-base">
                                    {resource.description || "No detailed description has been provided for this resource."}
                                </p>
                            </section>

                            {resource.availabilityWindow && (
                                <section>
                                    <div className="flex items-center mb-4">
                                        <Clock className="w-5 h-5 text-primary mr-2" />
                                        <h3 className="text-xl font-bold text-text-primary">Operational Hours</h3>
                                    </div>
                                    <div className="bg-background rounded-xl p-5 border border-bordercolor">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-text-secondary mb-1">Standard Availability</span>
                                                <span className="text-lg font-bold text-text-primary">
                                                    {resource.availabilityWindow.startTime} — {resource.availabilityWindow.endTime}
                                                </span>
                                            </div>
                                            <Calendar className="w-8 h-8 text-primary opacity-20" />
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>
                        
                        {/* Action Column */}
                        <div className="lg:col-span-1">
                            <div className="bg-background rounded-2xl p-6 border border-bordercolor sticky top-24">
                                <h3 className="text-lg font-bold text-text-primary mb-6">Operations Hub</h3>
                                
                                <div className="space-y-4">
                                    <button 
                                        className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent shadow-sm text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors" 
                                        disabled={resource.status !== 'ACTIVE'}
                                    >
                                        <Calendar className="w-5 h-5 mr-2" />
                                        Book Resource (Module 2)
                                    </button>

                                    <div className="pt-6 border-t border-bordercolor mt-6">
                                        <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-4">Administrative Options</p>
                                        <button 
                                            onClick={() => navigate('/admin/resources')}
                                            className="w-full flex justify-center py-2.5 px-4 border border-bordercolor shadow-sm text-sm font-bold rounded-xl text-text-primary bg-surface hover:bg-gray-50 transition-colors"
                                        >
                                            Manage in Admin Panel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResourceDetailsPage;
