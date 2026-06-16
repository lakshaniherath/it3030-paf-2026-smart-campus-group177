import React from 'react';
import { FiCheck } from 'react-icons/fi';

const steps = [
    { id: 'OPEN', label: 'Opened' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
    { id: 'CLOSED', label: 'Closed' },
];

const TicketStatusStepper = ({ currentStatus }) => {
    const status = currentStatus || 'OPEN';
    const currentIndex = steps.findIndex(s => s.id === status);

    return (
        <div className="flex items-center w-full">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all z-10 ${
                            index < currentIndex
                                ? 'bg-blue-600 border-blue-600 text-white'
                                : index === currentIndex
                                ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                                : 'bg-white border-slate-200 text-slate-400'
                        }`}>
                            {index < currentIndex ? <FiCheck size={14} /> : index + 1}
                        </div>
                        <span className={`mt-2 text-xs font-semibold whitespace-nowrap ${
                            index <= currentIndex ? 'text-blue-700' : 'text-slate-400'
                        }`}>
                            {step.label}
                        </span>
                    </div>
                    {index !== steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-1 rounded-full transition-all ${
                            index < currentIndex ? 'bg-blue-500' : 'bg-slate-100'
                        }`} />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default TicketStatusStepper;
