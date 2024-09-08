import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { getEchoes, getTrendingTopics } from '../lib/db';
import EchoPlayer from './EchoPlayer';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

const CarNavigationMode = () => {
  const [echoes, setEchoes] = useState([]);
  const [currentEchoIndex, setCurrentEchoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [selectedTrend, setSelectedTrend] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEchoes = await getEchoes();
      const fetchedTopics = await getTrendingTopics();
      setTrendingTopics([{ name: 'All' }, ...fetchedTopics]);
      setEchoes(fetchedEchoes);
    };
    fetchData();
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying && echoes.length > 0) {
      timer = setTimeout(() => {
        if (currentEchoIndex < echoes.length - 1) {
          setCurrentEchoIndex(prevIndex => prevIndex + 1);
        } else {
          setIsPlaying(false);
        }
      }, 10000); // Move to next echo after 10 seconds
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentEchoIndex, echoes]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToNext = () => {
    if (currentEchoIndex < echoes.length - 1) {
      setCurrentEchoIndex(prevIndex => prevIndex + 1);
    }
  };

  const skipToPrevious = () => {
    if (currentEchoIndex > 0) {
      setCurrentEchoIndex(prevIndex => prevIndex - 1);
    }
  };

  const exitCarMode = () => {
    navigate('/');
  };

  const handleTrendChange = (trend) => {
    setSelectedTrend(trend);
    setCurrentEchoIndex(0);
    filterAndSortEchoes(trend, sortBy);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    filterAndSortEchoes(selectedTrend, sort);
  };

  const filterAndSortEchoes = (trend, sort) => {
    let filteredEchoes = trend === 'All' ? echoes : echoes.filter(echo => echo.trend === trend);
    
    switch (sort) {
      case 'newest':
        filteredEchoes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'mostLiked':
        filteredEchoes.sort((a, b) => b.likes - a.likes);
        break;
      case 'trending':
        filteredEchoes.sort((a, b) => (b.likes + b.replies) - (a.likes + a.replies));
        break;
      default:
        break;
    }
    
    setEchoes(filteredEchoes);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 text-white flex flex-col items-center justify-between p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Car Navigation Mode</h1>
        
        <h2 className="text-xl font-semibold mb-2">Select Trend</h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2">
            {trendingTopics.map((topic) => (
              <Button
                key={topic.name}
                variant={selectedTrend === topic.name ? "default" : "outline"}
                className="h-16 text-lg bg-transparent border-white text-white hover:bg-white hover:text-black transition-colors"
                onClick={() => handleTrendChange(topic.name)}
              >
                {topic.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Sort By</h2>
          <div className="flex justify-between">
            {['newest', 'mostLiked', 'trending'].map((sort) => (
              <Button
                key={sort}
                variant="ghost"
                className={`text-lg ${sortBy === sort ? 'text-white underline' : 'text-gray-400'}`}
                onClick={() => handleSortChange(sort)}
              >
                {sort.charAt(0).toUpperCase() + sort.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {echoes.length > 0 && (
        <div className="w-full max-w-md flex-grow flex flex-col justify-center">
          <h2 className="text-xl mb-4 text-center">{echoes[currentEchoIndex].title}</h2>
          <div className="flex-grow flex items-center">
            <EchoPlayer src={echoes[currentEchoIndex].audioData} autoPlay={isPlaying} />
          </div>
          <div className="flex justify-center space-x-4 mt-8">
            <Button 
              onClick={skipPrevious} 
              size="lg" 
              className="h-16 w-16 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-colors"
            >
              <SkipBack className="h-8 w-8 text-white" />
            </Button>
            <Button 
              onClick={togglePlayPause} 
              size="lg" 
              className="h-16 w-16 bg-white text-black hover:bg-gray-200 transition-colors"
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
            </Button>
            <Button 
              onClick={skipToNext} 
              size="lg" 
              className="h-16 w-16 bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-colors"
            >
              <SkipForward className="h-8 w-8 text-white" />
            </Button>
          </div>
        </div>
      )}

      <Button 
        onClick={exitCarMode} 
        className="mt-8 bg-white text-black hover:bg-gray-200 border-2 border-white" 
        size="lg"
      >
        <ArrowLeft className="h-6 w-6 mr-2" />
        Exit Car Mode
      </Button>
    </div>
  );
};

export default CarNavigationMode;