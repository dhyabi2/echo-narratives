import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { getEchoes } from '../lib/db';
import EchoPlayer from './EchoPlayer';

const CarNavigationMode = () => {
  const [echoes, setEchoes] = useState([]);
  const [currentEchoIndex, setCurrentEchoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEchoes = async () => {
      const fetchedEchoes = await getEchoes();
      setEchoes(fetchedEchoes);
    };
    fetchEchoes();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Car Navigation Mode</h1>
      {echoes.length > 0 && (
        <div className="w-full max-w-md">
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
        Exit Car Mode
      </Button>
    </div>
  );
};

export default CarNavigationMode;