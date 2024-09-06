import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ArrowDownUp } from 'lucide-react';
import EchoCard from './EchoCard';
import TrendingTopics from './TrendingTopics';
import CategoryFilter from './CategoryFilter';
import SearchEchoes from './SearchEchoes';
import RecommendedEchoes from './RecommendedEchoes';

const sortOptions = ['Trending', 'Newest', 'Most Liked'];

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [echoes, setEchoes] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch echoes and categories from the API
    // This is a placeholder for actual API calls
    setEchoes([
      { id: 1, title: 'Best Advice I Ever Received', duration: '1:30', likes: 120, category: 'Advice' },
      { id: 2, title: 'My Biggest Confession', duration: '2:15', likes: 85, category: 'Confession' },
      { id: 3, title: 'A Love Story to Remember', duration: '3:00', likes: 200, category: 'Love' },
    ]);
    setCategories(['All', 'Advice', 'Confession', 'Love', 'Travel', 'Music']);
  }, []);

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
        {echoes.map((echo) => (
          <EchoCard key={echo.id} echo={echo} />
        ))}
      </div>

      <RecommendedEchoes />
    </div>
  );
};

export default HomeScreen;