import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ArrowDownUp, Mic } from 'lucide-react';
import EchoCard from './EchoCard';
import TrendingTopics from './TrendingTopics';
import RecommendedEchoes from './RecommendedEchoes';
import { getEchoes, getTrendingTopics } from '../lib/db';
import { useNavigate } from 'react-router-dom';

const sortOptions = ['Trending', 'Newest', 'Most Liked'];

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('Trending');
  const [echoes, setEchoes] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [latestTrends, setLatestTrends] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEchoes = await getEchoes();
      const fetchedTopics = await getTrendingTopics();
      setEchoes(fetchedEchoes);
      setTrendingTopics(fetchedTopics);
      setLatestTrends(fetchedTopics.slice(0, 5)); // Get the 5 most recent trends
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

  const filteredEchoes = echoes.filter(echo => 
    activeTab === 'all' || echo.trend === activeTab
  );

  const sortedEchoes = [...filteredEchoes].sort((a, b) => {
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

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Today's Top Echoes</h2>
        <Button variant="outline" size="sm" onClick={() => {
          const nextIndex = (sortOptions.indexOf(sortBy) + 1) % sortOptions.length;
          setSortBy(sortOptions[nextIndex]);
        }}>
          <ArrowDownUp className="h-4 w-4 mr-2" />
          {sortBy}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="latest">Latest Trends</TabsTrigger>
          {trendingTopics.map(topic => (
            <TabsTrigger key={topic.id} value={topic.name}>{topic.name}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all">
          <div className="space-y-6">
            {sortedEchoes.map((echo) => (
              <EchoCard key={echo.id} echo={echo} onEchoUpdated={handleEchoUpdated} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="latest">
          <div className="space-y-6">
            {latestTrends.map((trend) => (
              <div key={trend.id} className="p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold">{trend.name}</h3>
                <p className="text-sm text-gray-500">Echoes: {trend.echoCount}</p>
              </div>
            ))}
          </div>
        </TabsContent>
        {trendingTopics.map(topic => (
          <TabsContent key={topic.id} value={topic.name}>
            <div className="space-y-6">
              {sortedEchoes.filter(echo => echo.trend === topic.name).map((echo) => (
                <EchoCard key={echo.id} echo={echo} onEchoUpdated={handleEchoUpdated} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

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