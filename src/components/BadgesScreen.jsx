import React, { useState, useEffect } from 'react';
import { Award } from 'lucide-react';
import { Progress } from './ui/progress';
import { getBadges } from '../lib/db';

const BadgesScreen = () => {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const fetchBadges = async () => {
      const fetchedBadges = await getBadges();
      setBadges(fetchedBadges);
    };
    fetchBadges();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Badges & Achievements</h2>
      <div className="grid grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div key={badge.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center mb-2">
              <Award className={`h-8 w-8 mr-2 ${badge.earned ? 'text-yellow-500' : 'text-gray-400'}`} />
              <h3 className="font-semibold">{badge.name}</h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
            <Progress value={badge.progress} className="mb-2" />
            <p className="text-xs text-gray-500">{badge.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgesScreen;