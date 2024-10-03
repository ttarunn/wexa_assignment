import React from 'react';
import { useSelector } from 'react-redux';

const ActivityFeed = () => {
  const activities = useSelector((state) => state.dashboard.activities);

  return (
    <div>
      <h3 className="text-lg font-semibold">Activity Feed</h3>
      <ul>
        {activities.map(activity => (
          <li key={activity.id} className="p-2 border-b">{activity.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
