import React from 'react';
import { Bell } from 'lucide-react';

const NotificationItem = ({ notification }) => {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow">
      <Bell className="h-6 w-6 text-blue-500 mr-3" />
      <div>
        <p className="font-medium">{notification.message}</p>
        <p className="text-sm text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default NotificationItem;