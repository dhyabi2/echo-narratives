import React from 'react';
import { useUserAchievements } from '../hooks/useUserAchievements';

const UserAchievements = ({ userId }) => {
  const { achievements, isLoading, error } = useUserAchievements(userId);

  if (isLoading) return <div>Loading achievements...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="grid grid-cols-3 gap-4">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="bg-gray-100 p-4 rounded text-center">
          <img src={achievement.icon} alt={achievement.name} className="w-16 h-16 mx-auto mb-2" />
          <h3 className="font-semibold">{achievement.name}</h3>
          <p className="text-sm text-gray-600">{achievement.description}</p>
        </div>
      ))}
    </div>
  );
};

export default UserAchievements;