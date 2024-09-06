import React, { useState } from 'react';
import { Switch } from './ui/switch';
import { Label } from './ui/label';

const PrivacySettings = () => {
  const [settings, setSettings] = useState({
    anonymousPosting: true,
    showProfileToFollowers: false,
    allowDirectMessages: true,
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="anonymousPosting">Anonymous Posting</Label>
        <Switch
          id="anonymousPosting"
          checked={settings.anonymousPosting}
          onCheckedChange={() => handleToggle('anonymousPosting')}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="showProfileToFollowers">Show Profile to Followers</Label>
        <Switch
          id="showProfileToFollowers"
          checked={settings.showProfileToFollowers}
          onCheckedChange={() => handleToggle('showProfileToFollowers')}
        />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="allowDirectMessages">Allow Direct Messages</Label>
        <Switch
          id="allowDirectMessages"
          checked={settings.allowDirectMessages}
          onCheckedChange={() => handleToggle('allowDirectMessages')}
        />
      </div>
    </div>
  );
};

export default PrivacySettings;