import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Heart, Mic, Volume2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import EchoComments from './EchoComments';
import { updateEcho } from '../lib/db';

const EchoPlaybackOverlay = ({ echo, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const audioRef = useRef(null);

  useEffect(() => {
    if (echo && echo.audioData && audioRef.current) {
      audioRef.current.src = echo.audioData;

      const updateProgress = () => {
        if (audioRef.current) {
          setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
        }
      };

      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
      };

      audioRef.current.addEventListener('timeupdate', updateProgress);
      audioRef.current.addEventListener('ended', handleEnded);

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener('timeupdate', updateProgress);
          audioRef.current.removeEventListener('ended', handleEnded);
        }
      };
    }
  }, [echo]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      const seekTime = (value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTime;
      setProgress(value);
    }
  };

  const handleVolumeChange = (value) => {
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
      setVolume(value);
    }
  };

  const handleLike = async () => {
    if (echo) {
      const updatedEcho = { ...echo, likes: (echo.likes || 0) + 1 };
      await updateEcho(updatedEcho);
    }
  };

  return (
    <Dialog open={!!echo} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{echo?.title}</DialogTitle>
        </DialogHeader>
        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-4">
            <audio ref={audioRef} />
            <Slider value={[progress]} max={100} step={1} onValueChange={(value) => handleSeek(value[0])} />
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="icon" onClick={() => handleSeek(Math.max(progress - 10, 0))}>
                <SkipBack className="h-6 w-6" />
              </Button>
              <Button variant="outline" size="icon" className="h-16 w-16" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleSeek(Math.min(progress + 10, 100))}>
                <SkipForward className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Volume2 className="h-5 w-5" />
              <Slider
                value={[volume]}
                max={100}
                step={1}
                onValueChange={(value) => handleVolumeChange(value[0])}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button variant="ghost" size="lg" onClick={handleLike}>
              <Heart className="h-6 w-6 mr-2" />
              Like ({echo?.likes || 0})
            </Button>
            <Button variant="ghost" size="lg">
              <Mic className="h-6 w-6 mr-2" />
              Reply
            </Button>
          </div>
          <div className="mt-4 flex-grow overflow-y-auto">
            <EchoComments echoId={echo?.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EchoPlaybackOverlay;