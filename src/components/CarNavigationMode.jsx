import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { getEchoes } from '../lib/db';
import EchoPlayer from './EchoPlayer';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

const CarNavigationMode = () => {
  const [echoes, setEchoes] = useState([]);
  const [currentEchoIndex, setCurrentEchoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedEchoes = await getEchoes();
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

  return (
    <div className="fixed inset-0 bg-gray-100 text-gray-800 flex flex-col items-center justify-between p-4">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Car Mode</h1>
      </div>

      {echoes.length > 0 && (
        <div className="w-full max-w-md flex-grow flex flex-col justify-center">
          <h2 className="text-xl mb-4 text-center">{echoes[currentEchoIndex].title}</h2>
          <div className="flex-grow flex items-center">
            <EchoPlayer src={echoes[currentEchoIndex].audioData} autoPlay={isPlaying} />
          </div>
          <div className="flex justify-center space-x-4 mt-8">
            <Button onClick={skipToPrevious} size="icon" variant="outline">
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button onClick={togglePlayPause} size="icon" variant="default">
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            <Button onClick={skipToNext} size="icon" variant="outline">
              <SkipForward className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      <Button 
        onClick={exitCarMode} 
        className="mt-8" 
        variant="ghost"
      >
        <ArrowLeft className="h-6 w-6 mr-2" />
        Exit Car Mode
      </Button>
    </div>
  );
};

export default CarNavigationMode;