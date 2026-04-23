import React from 'react';
import StatusBadge from './StatusBadge';
import TypeBadge from './TypeBadge';
import { MapPin, Users, ChevronRight } from 'lucide-react';

const ResourceCard = ({ resource, onClick }) => {
    const imageUrl = resource.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.name)}&background=F8FAFC&color=2563EB&size=300`;

    return (
        <div 
            onClick={() => onClick(resource.id)}
            className="group flex flex-col bg-surface rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden border border-bordercolor h-full"
        >
            <div className="relative h-48 w-full overflow-hidden bg-background">
                <img 
                    src={imageUrl} 
                    alt={resource.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found'; }}
                />
                <div className="absolute top-3 right-3 shadow-sm rounded-full">
                    <StatusBadge status={resource.status} />
                </div>
            </div>
            
            <div className="p-5 flex-grow flex flex-col pt-4">
                <div className="mb-2">
                    <TypeBadge type={resource.type} />
                </div>
                
                <h3 className="text-xl font-bold text-text-primary mb-3 line-clamp-1 group-hover:text-primary transition-colors" title={resource.name}>
                    {resource.name}
                </h3>
                
                <div className="flex items-center text-sm text-text-secondary mb-2">
                    <MapPin className="w-4 h-4 mr-2 text-primary" />
                    <span className="truncate">{resource.location}</span>
                </div>
                
                <div className="flex items-center text-sm text-text-secondary mb-5">
                    <Users className="w-4 h-4 mr-2 text-primary" />
                    <span>Capacity: <span className="font-semibold text-text-primary">{resource.capacity}</span></span>
                </div>
                
                <div className="mt-auto pt-4 border-t border-bordercolor flex justify-between items-center">
                    <span className="text-xs font-mono font-medium text-text-secondary bg-background px-2 py-1 rounded">
                        {resource.code}
                    </span>
                    <span className="text-sm font-semibold text-primary flex items-center group-hover:text-primary-hover">
                        Details
                        <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
