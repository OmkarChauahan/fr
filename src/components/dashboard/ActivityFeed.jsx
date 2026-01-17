import React from 'react';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="activity-list-modern">
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item-modern">
          <div className={`activity-indicator ${activity.color}`}></div>
          <div className="activity-content-modern">
            <p>{activity.message}</p>
            <span className="activity-time">{activity.time}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;