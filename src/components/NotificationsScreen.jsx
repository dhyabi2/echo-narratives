import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Trash2 } from 'lucide-react';
import { Button } from './ui/button';

const API_BASE_URL = 'https://ekos-api.replit.app';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_BASE_URL}/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    fetchNotifications();
  }, []);

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  const groupedNotifications = notifications.reduce((acc, notification) => {
    const date = new Date(notification.createdAt).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(notification);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Notifications</h2>
        <Button variant="ghost" size="sm" onClick={handleClearAll}>
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>
      {Object.entries(groupedNotifications).map(([date, notifs]) => (
        <div key={date} className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{date}</h3>
          {notifs.map((notification) => (
            <div key={notification.id} className="bg-white rounded-lg shadow p-4 mb-2">
              <div className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-blue-500" />
                <p>{notification.message}</p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default NotificationsScreen;
