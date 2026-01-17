import React from 'react';
import { getBadgeColor } from '../../utils/helpers';

const Badge = ({ children, color, status }) => {
  const badgeColor = color || getBadgeColor(status || children);
  
  return (
    <span className={`badge badge-${badgeColor}`}>
      {children}
    </span>
  );
};

export default Badge;