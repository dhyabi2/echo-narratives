import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ArrowDownUp } from 'lucide-react';
import EchoCard from './EchoCard';
import EchoPlaybackOverlay from './EchoPlaybackOverlay';
import TrendingTopics from './TrendingTopics';
import CategoryFilter from './CategoryFilter';
import SearchEchoes from './SearchEchoes';
import RecommendedEchoes from './RecommendedEchoes';
import { getEchoes, getCategories } from '../utils/localStorage';

const sortOptions = ['Trending', 'Newest', 'Most Liked'];

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [playingEcho, setPlayingEcho] = useState(null);
  const [echoes, setEchoes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setEchoes(getEchoes());
    setCategories(['All', ...getCategories()]);
  }, []);

  const handlePlay = (echo) => {
    setPlayingEcho(echo);
  };

  const handleClosePlayback = () => {
    setPlayingEcho(null);
  };

  const filteredEchoes = echoes.filter(echo => 
    activeCategory === 'All' || echo.category === activeCategory
  );

  const sortedEchoes = [...filteredEchoes].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'Most Liked') {
      return b.likes - a.likes;
    }
    // For 'Trending', we could implement a more complex algorithm
    return b.likes + b.replies - (a.likes + a.replies);
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Echo Feed</h1>
      
      <CategoryFilter categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Today's Top Echoes</h2>
        <Button variant="outline" size="sm" onClick={() => {
          const nextIndex = (sortOptions.indexOf(sortBy) + 1) % sortOptions.length;
          setSortBy(sortOptions[nextIndex]);
        }}>
          <ArrowDownUp className="h-4 w-4 mr-2" />
          {sortBy}
        </Button>
      </div>

      <TrendingTopics />

      <SearchEchoes />

      <div className="space-y-4 mt-4">
        {sortedEchoes.map((echo) => (
          <EchoCard key={echo.id} echo={echo} onPlay={handlePlay} />
        ))}
      </div>

      <RecommendedEchoes />

      {playingEcho && (
        <EchoPlaybackOverlay echo={playingEcho} onClose={handleClosePlayback} />
      )}
    </div>
  );
};

export default HomeScreen;