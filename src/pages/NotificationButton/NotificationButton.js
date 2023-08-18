import React from 'react';

const NotificationButton = ({ requestNotificationPermission }) => {
  return (
    <button onClick={requestNotificationPermission}>
      Request Notification Permission
    </button>
  );
};

export default NotificationButton;
