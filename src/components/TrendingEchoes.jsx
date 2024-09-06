import React from 'react';
import { useTrendingEchoes } from '../hooks/useTrendingEchoes';
import EchoList from './EchoList.jsx';

const TrendingEchoes = () => {
  const { echoes, isLoading, error } = useTrendingEchoes();

  if (isLoading) return <div>Loading trending echoes...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Trending Echoes</h2>
      <EchoList echoes={echoes} />
    </div>
  );
};

export default TrendingEchoes;