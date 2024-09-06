import React, { useState, useEffect } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Heart, Mic, Volume2, Music } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import AudioWaveform from './AudioWaveform';
import EchoComments from './EchoComments';
import RelatedEchoes from './RelatedEchoes';

const EchoPlaybackOverlay = ({ echo, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setIsPlaying(false);
            return 100;
          }
          return prevProgress + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const togglePlayPause = () => setIsPlaying(!isPlaying);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold mb-4">{echo.title}</h2>
        <p className="text-gray-500 mb-4">{echo.category}</p>
        <AudioWaveform progress={progress} />
        <Slider value={[progress]} max={100} step={1} className="mb-4" />
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="icon">
            <SkipBack className="h-6 w-6" />
          </Button>
          <Button variant="outline" size="icon" className="h-16 w-16" onClick={togglePlayPause}>
            {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
          </Button>
          <Button variant="ghost" size="icon">
            <SkipForward className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex items-center mb-4">
          <Volume2 className="h-5 w-5 mr-2" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            className="w-full"
          />
        </div>
        <div className="flex items-center mb-4">
          <Music className="h-5 w-5 mr-2" />
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="border rounded p-1"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={1.5}>1.5x</option>
            <option value={2}>2x</option>
          </select>
        </div>
        <div className="flex justify-between">
          <Button variant="ghost" size="lg">
            <Heart className="h-6 w-6 mr-2" />
            Like
          </Button>
          <Button variant="ghost" size="lg">
            <Mic className="h-6 w-6 mr-2" />
            Reply
          </Button>
        </div>
        <EchoComments echoId={echo.id} />
        <RelatedEchoes echoId={echo.id} />
      </div>
    </div>
  );
};

export default EchoPlaybackOverlay;