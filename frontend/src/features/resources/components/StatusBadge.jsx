import React from 'react';
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

const STATUS_CONFIG = {
    ACTIVE:          { icon: FiCheckCircle,   cls: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    OUT_OF_SERVICE:  { icon: FiAlertTriangle, cls: 'bg-rose-100 text-rose-700 border-rose-200' },
    INACTIVE:        { icon: FiXCircle,       cls: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const StatusBadge = ({ status }) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.INACTIVE;
    const Icon = config.icon;
    return (
        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.cls}`}>
            <Icon size={11} />
            {status.replace(/_/g, ' ')}
        </span>
    );
};

export default StatusBadge;
