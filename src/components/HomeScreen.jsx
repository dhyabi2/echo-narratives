import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ArrowDownUp, Mic } from 'lucide-react';
import EchoCard from './EchoCard';
import TrendingTopics from './TrendingTopics';
import RecommendedEchoes from './RecommendedEchoes';
import { getEchoes, getTrendingTopics } from '../lib/db';
import { useNavigate } from 'react-router-dom';

const sortOptions = ['Trending', 'Newest', 'Most Liked'];

const HomeScreen = () => {
  const [sortBy, setSortBy] = useState('Trending');
  const [echoes, setEchoes] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEchoes = await getEchoes();
      const fetchedTopics = await getTrendingTopics();
      setEchoes(fetchedEchoes);
      setTrendingTopics(fetchedTopics);
    };
    fetchData();

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handleEchoUpdated = (updatedEcho) => {
    setEchoes(prevEchoes => prevEchoes.map(echo => echo.id === updatedEcho.id ? updatedEcho : echo));
  };

  const sortedEchoes = [...echoes].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'Most Liked') {
      return b.likes - a.likes;
    }
    return b.likes + b.replies - (a.likes + a.replies);
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Echo Feed</h1>
      
      {!isOnline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>You are currently offline. Some features may be limited.</p>
        </div>
      )}

      <TrendingTopics />

      <div className="flex justify-end mb-6">
        <Button variant="outline" size="sm" onClick={() => {
          const nextIndex = (sortOptions.indexOf(sortBy) + 1) % sortOptions.length;
          setSortBy(sortOptions[nextIndex]);
        }}>
          <ArrowDownUp className="h-4 w-4 mr-2" />
          {sortBy}
        </Button>
      </div>

      <div className="space-y-6">
        {sortedEchoes.map((echo) => (
          <EchoCard key={echo.id} echo={echo} onEchoUpdated={handleEchoUpdated} />
        ))}
      </div>

      <RecommendedEchoes />

      <Button 
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg"
        onClick={() => navigate('/record')}
      >
        <Mic className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default HomeScreen;