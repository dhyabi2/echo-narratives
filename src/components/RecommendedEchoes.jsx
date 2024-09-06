import React, { useEffect, useState } from 'react';
import { getRecommendedEchoes } from '../lib/db';
import EchoList from './EchoList';

const RecommendedEchoes = ({ userId }) => {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const recommendedEchoes = await getRecommendedEchoes(userId);
      setRecommendations(recommendedEchoes);
    };
    fetchRecommendations();
  }, [userId]);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recommended for You</h2>
      <EchoList echoes={recommendations} />
    </div>
  );
};

export default RecommendedEchoes;