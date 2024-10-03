import React from 'react';
import { useSelector } from 'react-redux';

const Notifications = () => {
  const notifications = useSelector((state) => state.notifications.notifications);

  return (
    <div>
      <h3 className="text-lg font-semibold">Notifications</h3>
      <ul>
        {notifications.map(notification => (
          <li key={notification.id} className="p-2 border-b">{notification.message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
