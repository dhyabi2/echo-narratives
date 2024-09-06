import React from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useNotificationSettings } from '../hooks/useNotificationSettings';

const NotificationSettings = () => {
  const { settings, updateSetting, isLoading } = useNotificationSettings();

  if (isLoading) return <div>Loading settings...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Notification Settings</h2>
      {Object.entries(settings).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between">
          <Label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
          <Switch
            id={key}
            checked={value}
            onCheckedChange={(checked) => updateSetting(key, checked)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationSettings;