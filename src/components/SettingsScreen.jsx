import React, { useState } from 'react';
import { Bell, Globe, Lock, Info, FileText } from 'lucide-react';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

const SettingsScreen = () => {
  const [notifications, setNotifications] = useState({
    likes: true,
    replies: true,
    newEchoes: false,
  });
  const [language, setLanguage] = useState('en');

  const toggleNotification = (type) => {
    setNotifications((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Notifications</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              <span>Likes</span>
            </div>
            <Switch checked={notifications.likes} onCheckedChange={() => toggleNotification('likes')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              <span>Replies</span>
            </div>
            <Switch checked={notifications.replies} onCheckedChange={() => toggleNotification('replies')} />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              <span>New Echoes</span>
            </div>
            <Switch checked={notifications.newEchoes} onCheckedChange={() => toggleNotification('newEchoes')} />
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Language Preferences</h3>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Privacy</h3>
        <Button variant="outline" className="w-full justify-start">
          <Lock className="h-5 w-5 mr-2" />
          Manage Privacy Settings
        </Button>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <Button variant="outline" className="w-full justify-start mb-2">
          <Info className="h-5 w-5 mr-2" />
          App Information
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <FileText className="h-5 w-5 mr-2" />
          Terms of Service
        </Button>
      </div>
    </div>
  );
};

export default SettingsScreen;