import React, { useState, useEffect } from 'react';
import { User, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { getEchoes, getBadges } from '../lib/db';

const ProfileScreen = () => {
  const [echoes, setEchoes] = useState([]);
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEchoes = await getEchoes();
      const fetchedBadges = await getBadges();
      setEchoes(fetchedEchoes);
      setBadges(fetchedBadges);
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Profile</h2>
        <Button variant="ghost" size="icon">
          <Settings className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex items-center mb-6">
        <User className="h-16 w-16 text-gray-400 mr-4" />
        <div>
          <h3 className="text-xl font-semibold">Anonymous User</h3>
          <p className="text-gray-500">Guest</p>
        </div>
      </div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Your Echoes</h3>
        {echoes.map((echo) => (
          <div key={echo.id} className="bg-white rounded-lg shadow p-4 mb-2">
            <h4 className="font-medium">{echo.title}</h4>
            <p className="text-sm text-gray-500">Likes: {echo.likes} | Replies: {echo.replies}</p>
          </div>
        ))}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">Badges</h3>
        <div className="grid grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div key={badge.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
              <span className="text-2xl mb-2">{badge.icon}</span>
              <span className="text-sm text-center">{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;