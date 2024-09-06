import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { ArrowDownUp } from 'lucide-react';
import EchoCard from './EchoCard';
import EchoPlaybackOverlay from './EchoPlaybackOverlay';

const categories = ['All', 'Confessions', 'Life Advice', 'Love Stories'];
const sortOptions = ['Trending', 'Newest', 'Most Liked'];

const mockEchoes = [
  { id: 1, title: 'Best Advice I Ever Received', duration: '1:30', likes: 120 },
  { id: 2, title: 'My Biggest Confession', duration: '2:15', likes: 85 },
  { id: 3, title: 'A Love Story to Remember', duration: '3:00', likes: 200 },
];

const HomeScreen = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Trending');
  const [playingEcho, setPlayingEcho] = useState(null);

  const handlePlay = (echo) => {
    setPlayingEcho(echo);
  };

  const handleClosePlayback = () => {
    setPlayingEcho(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Echo Feed</h1>
      
      <Tabs defaultValue={activeCategory} className="mb-4">
        <TabsList>
          {categories.map((category) => (
            <TabsTrigger
              key={category}
              value={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

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

      <div className="space-y-4">
        {mockEchoes.map((echo) => (
          <EchoCard key={echo.id} echo={echo} onPlay={handlePlay} />
        ))}
      </div>

      {playingEcho && (
        <EchoPlaybackOverlay echo={playingEcho} onClose={handleClosePlayback} />
      )}
    </div>
  );
};

export default HomeScreen;