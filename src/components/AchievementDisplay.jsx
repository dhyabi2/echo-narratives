import React from 'react';
import { Trophy } from 'lucide-react';

const AchievementDisplay = ({ achievements }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
          <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
          <h3 className="font-semibold text-center">{achievement.name}</h3>
          <p className="text-sm text-gray-500 text-center">{achievement.description}</p>
        </div>
      ))}
    </div>
  );
};

export default AchievementDisplay;