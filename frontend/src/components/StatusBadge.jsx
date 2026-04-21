import React from 'react';

const STATUS_COLORS = {
  OPEN: '#3b82f6',
  IN_PROGRESS: '#f59e0b',
  RESOLVED: '#10b981',
  CLOSED: '#6b7280',
  REJECTED: '#ef4444',
};

export default function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || '#6b7280';
  return (
    <span
      className="badge"
      style={{ backgroundColor: color }}
    >
      {status}
    </span>
  );
}
