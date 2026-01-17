// src/components/dashboard/StatCard.jsx

import React from 'react';

const StatCard = ({ title, value, change, icon: Icon, color, subtitle }) => {
  const getChangeClass = () => {
    if (change > 0) return 'positive';
    if (change < 0) return 'negative';
    return 'neutral';
  };

  const formatValue = (val) => {
    if (typeof val === 'number' && val >= 1000) {
      return `₹${val.toLocaleString('en-IN')}`;
    }
    return val;
  };

  const formatChange = (val) => {
    // Remove % if already present in value
    const cleanVal = String(val).replace('%', '');
    return `${cleanVal > 0 ? '' : ''}${cleanVal}%`;
  };

  return (
    <div className="stat-card-modern">
      <div className="stat-card-header">
        <div className={`stat-icon-modern ${color}`}>
          <Icon size={24} />
        </div>
        <span className={`stat-change-badge ${getChangeClass()}`}>
          {formatChange(change)}
        </span>
      </div>
      <div className="stat-card-body">
        <h3>{title}</h3>
        <div className="stat-value-modern">{formatValue(value)}</div>
        <p className="stat-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatCard;