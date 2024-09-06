import { useState, useEffect } from 'react';
import { getEchoes } from '../lib/db';

export const useTrendingEchoes = () => {
  const [echoes, setEchoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingEchoes = async () => {
      try {
        setIsLoading(true);
        const allEchoes = await getEchoes();
        const sortedEchoes = allEchoes.sort((a, b) => b.likes - a.likes).slice(0, 10);
        setEchoes(sortedEchoes);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingEchoes();
  }, []);

  return { echoes, isLoading, error };
};