import React from 'react';
import StatusBadge from './StatusBadge';
import TypeBadge from './TypeBadge';
import { FiMapPin, FiUsers, FiArrowRight } from 'react-icons/fi';

const ResourceCard = ({ resource, onClick }) => {
    const imageUrl = resource.imageUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.name)}&background=EFF6FF&color=2563EB&size=300`;

    return (
        <div
            onClick={() => onClick(resource.id)}
            className="group flex flex-col bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 cursor-pointer overflow-hidden h-full"
        >
            {/* Image */}
            <div className="relative h-44 w-full overflow-hidden bg-blue-50">
                <img
                    src={imageUrl}
                    alt={resource.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(resource.name)}&background=EFF6FF&color=2563EB&size=300`; }}
                />
                <div className="absolute top-3 right-3">
                    <StatusBadge status={resource.status} />
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex-grow flex flex-col">
                <div className="mb-2">
                    <TypeBadge type={resource.type} />
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-3 line-clamp-1 group-hover:text-blue-700 transition-colors">
                    {resource.name}
                </h3>

                <div className="flex items-center text-sm text-slate-500 mb-1.5">
                    <FiMapPin className="w-3.5 h-3.5 mr-1.5 text-blue-400 flex-shrink-0" />
                    <span className="truncate">{resource.location}</span>
                </div>

                <div className="flex items-center text-sm text-slate-500 mb-4">
                    <FiUsers className="w-3.5 h-3.5 mr-1.5 text-blue-400 flex-shrink-0" />
                    <span>Capacity: <span className="font-semibold text-slate-700">{resource.capacity}</span></span>
                </div>

                <div className="mt-auto pt-3 border-t border-blue-50 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-400 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                        {resource.code}
                    </span>
                    <span className="text-sm font-semibold text-blue-600 flex items-center gap-1 group-hover:text-blue-800 transition-colors">
                        Details <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={13} />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
