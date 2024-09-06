import React, { useState, useEffect } from 'react';
import EchoCard from './EchoCard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const RecommendedEchoes = () => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch recommended echoes
    setRecommendations([
      { id: 6, title: 'Mindfulness Meditation Techniques', duration: '5:00', likes: 250, category: 'Wellness', author: 'ZenMaster', content: 'Discover simple mindfulness techniques to reduce stress and improve focus.' },
      { id: 7, title: 'The Future of AI in Healthcare', duration: '7:30', likes: 180, category: 'Technology', author: 'TechGuru', content: 'Exploring how artificial intelligence is revolutionizing medical diagnoses and treatment plans.' },
    ]);
  }, []);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Recommended for You</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((echo) => (
          <EchoCard key={echo.id} echo={echo} />
        ))}
      </CardContent>
    </Card>
  );
};

export default RecommendedEchoes;