import React, { useState, useEffect } from 'react';
import EchoCard from './EchoCard';

const RecommendedEchoes = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch recommended echoes
    // This is a placeholder for actual API calls
    setRecommendations([
      { id: 6, title: 'Recommended Echo 1', duration: '2:00', likes: 150, category: 'Recommended' },
      { id: 7, title: 'Recommended Echo 2', duration: '1:30', likes: 120, category: 'Recommended' },
    ]);
  }, []);

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
      <div className="space-y-4">
        {recommendations.map((echo) => (
          <EchoCard key={echo.id} echo={echo} />
        ))}
      </div>
    </div>
  );
};

export default RecommendedEchoes;