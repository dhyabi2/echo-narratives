import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ArrowDownUp, Mic, Search } from 'lucide-react';
import EchoCard from './EchoCard';
import EchoPlaybackOverlay from './EchoPlaybackOverlay';
import TrendingTopics from './TrendingTopics';
import CategoryFilter from './CategoryFilter';
import SearchEchoes from './SearchEchoes';
import RecommendedEchoes from './RecommendedEchoes';
import { getEchoes, getCategories } from '../utils/localStorage';
import { Input } from './ui/input';

const sortOptions = ['Trending', 'Newest', 'Most Liked'];

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [playingEcho, setPlayingEcho] = useState(null);
  const [echoes, setEchoes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setEchoes(getEchoes());
    setCategories(['All', ...getCategories()]);

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        setEchoes(getEchoes());
      }
    });

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  const handlePlay = (echo) => {
    setPlayingEcho(echo);
  };

  const handleClosePlayback = () => {
    setPlayingEcho(null);
  };

  const filteredEchoes = echoes.filter(echo => 
    (activeCategory === 'All' || echo.category === activeCategory) &&
    (echo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     echo.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const sortedEchoes = [...filteredEchoes].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'Most Liked') {
      return b.likes - a.likes;
    }
    return b.likes + b.replies - (a.likes + a.replies);
  });

  const handleShare = async (echo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: echo.title,
          text: `Check out this echo: ${echo.title}`,
          url: `https://echoes.app/echo/${echo.id}`,
        });
        console.log('Echo shared successfully');
      } catch (error) {
        console.error('Error sharing echo:', error);
      }
    } else {
      console.log('Web Share API not supported');
      // Fallback sharing method
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Echo Feed</h1>
      
      {!isOnline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>You are currently offline. Some features may be limited.</p>
        </div>
      )}

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search echoes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <CategoryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

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

      <TrendingTopics />

      <div className="space-y-6 mt-6">
        {sortedEchoes.map((echo) => (
          <EchoCard key={echo.id} echo={echo} onPlay={handlePlay} onShare={() => handleShare(echo)} />
        ))}
      </div>

      <RecommendedEchoes />

      {playingEcho && (
        <EchoPlaybackOverlay echo={playingEcho} onClose={handleClosePlayback} />
      )}

      <Button className="fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg" onClick={() => console.log('Record new echo')}>
        <Mic className="h-6 w-6" />
      </Button>
    </div>
  );
};

export default HomeScreen;