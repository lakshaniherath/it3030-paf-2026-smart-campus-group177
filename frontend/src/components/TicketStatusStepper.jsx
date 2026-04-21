import React from 'react';

const TicketStatusStepper = ({ currentStatus }) => {
  // Status එක නැති වුණොත් default එකක් ගන්නවා
  const status = currentStatus || 'OPEN';

  const steps = [
    { id: 'OPEN', label: 'Opened' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
    { id: 'CLOSED', label: 'Closed' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === status);

  return (
    <div className="w-full py-8 px-2" style={{ minHeight: '100px' }}>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="relative flex flex-col items-center group">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-all duration-500 z-10 ${
                index <= currentStepIndex 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-white border-slate-200 text-slate-400'
              }`}>
                {index < currentStepIndex ? '✓' : index + 1}
              </div>
              <div className={`absolute -bottom-8 w-max text-[10px] font-bold uppercase ${
                index <= currentStepIndex ? 'text-blue-600' : 'text-slate-500'
              }`}>
                {step.label}
              </div>
            </div>
            {index !== steps.length - 1 && (
              <div className="flex-auto -mx-1">
                <div className={`h-1 transition-all duration-700 ${
                  index < currentStepIndex ? 'bg-blue-600' : 'bg-slate-100'
                }`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default TicketStatusStepper; 