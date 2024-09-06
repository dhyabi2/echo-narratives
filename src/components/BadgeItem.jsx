import React from 'react';
import { Shield } from 'lucide-react';

const BadgeItem = ({ badge }) => {
  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow">
      <Shield className="h-12 w-12 text-yellow-500 mb-2" />
      <h3 className="font-medium text-center">{badge.name}</h3>
      <p className="text-sm text-gray-500 text-center mt-1">{badge.description}</p>
    </div>
  );
};

export default BadgeItem;