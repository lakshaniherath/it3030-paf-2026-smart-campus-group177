import React from 'react';

const PRIORITY_COLORS = {
  LOW: '#10b981',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
};

export default function PriorityBadge({ priority }) {
  const color = PRIORITY_COLORS[priority] || '#6b7280';
  return (
    <span
      className="badge badge-outline"
      style={{ borderColor: color, color }}
    >
      {priority}
    </span>
  );
}
