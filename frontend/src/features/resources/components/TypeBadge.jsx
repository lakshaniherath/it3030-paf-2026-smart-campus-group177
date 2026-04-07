import React from 'react';

const getBadgeColor = (type) => {
    switch (type) {
        case 'LECTURE_HALL': return 'bg-blue-50 text-blue-700 border-blue-200';
        case 'LAB': return 'bg-purple-50 text-purple-700 border-purple-200';
        case 'MEETING_ROOM': return 'bg-teal-50 text-teal-700 border-teal-200';
        case 'EQUIPMENT': return 'bg-amber-50 text-amber-700 border-amber-200';
        default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
};

const TypeBadge = ({ type }) => {
    return (
        <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider border ${getBadgeColor(type)}`}>
            {type.replace(/_/g, ' ')}
        </span>
    );
};

export default TypeBadge;
