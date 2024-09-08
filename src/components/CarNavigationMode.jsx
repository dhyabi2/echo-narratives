import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { getEchoes, getTrendingTopics } from '../lib/db';
import EchoPlayer from './EchoPlayer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

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

  const exitCarMode = () => {
    navigate('/');
  };

  const handleTrendChange = (value) => {
    setSelectedTrend(value);
    setCurrentEchoIndex(0);
    filterAndSortEchoes(value, sortBy);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    filterAndSortEchoes(selectedTrend, value);
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
    <div className="fixed inset-0 bg-black bg-opacity-90 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">Car Navigation Mode</h1>
      <div className="w-full max-w-md space-y-4">
        <Select value={selectedTrend} onValueChange={handleTrendChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Trend" />
          </SelectTrigger>
          <SelectContent>
            {trendingTopics.map((topic) => (
              <SelectItem key={topic.name} value={topic.name}>{topic.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="mostLiked">Most Liked</SelectItem>
            <SelectItem value="trending">Trending</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {echoes.length > 0 && (
        <div className="w-full max-w-md mt-8">
          <h2 className="text-xl mb-4">{echoes[currentEchoIndex].title}</h2>
          <EchoPlayer src={echoes[currentEchoIndex].audioData} autoPlay={isPlaying} />
          <div className="flex justify-center space-x-4 mt-8">
            <Button onClick={togglePlayPause} size="lg">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button onClick={skipToNext} size="lg">
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
      <Button onClick={exitCarMode} className="mt-8" variant="secondary">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Exit Car Mode
      </Button>
    </div>
  );
};

export default CarNavigationMode;