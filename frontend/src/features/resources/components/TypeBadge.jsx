import React from 'react';

const TYPE_CONFIG = {
    LECTURE_HALL: 'bg-blue-100 text-blue-700 border-blue-200',
    LAB:          'bg-violet-100 text-violet-700 border-violet-200',
    MEETING_ROOM: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    EQUIPMENT:    'bg-amber-100 text-amber-700 border-amber-200',
};

const TypeBadge = ({ type }) => (
    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider border ${TYPE_CONFIG[type] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
        {type.replace(/_/g, ' ')}
    </span>
);

export default TypeBadge;
