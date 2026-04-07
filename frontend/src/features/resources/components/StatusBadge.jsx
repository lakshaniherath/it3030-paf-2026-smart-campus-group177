import React from 'react';
import { LucideCheckCircle, LucideAlertTriangle, LucideXCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
    let colorClass = 'bg-status-inactiveBg text-text-secondary border-bordercolor';
    let Icon = LucideXCircle;

    if (status === 'ACTIVE') {
        colorClass = 'bg-status-successBg text-status-success border-status-success/20';
        Icon = LucideCheckCircle;
    } else if (status === 'OUT_OF_SERVICE') {
        colorClass = 'bg-status-dangerBg text-status-danger border-status-danger/20';
        Icon = LucideAlertTriangle;
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colorClass}`}>
            <Icon className="w-3.5 h-3.5 mr-1" />
            {status.replace(/_/g, ' ')}
        </span>
    );
};

export default StatusBadge;
