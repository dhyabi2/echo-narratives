import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, SkipBack, SkipForward, Heart, Mic, Volume2, Music } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import EchoComments from './EchoComments';
import RelatedEchoes from './RelatedEchoes';
import { updateEcho } from '../utils/localStorage';

const EchoPlaybackOverlay = ({ echo, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(100);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    if (echo && echo.audioData) {
      const audio = audioRef.current;
      audio.src = echo.audioData;

      const updateProgress = () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      };

      audio.addEventListener('timeupdate', updateProgress);
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });

      return () => {
        audio.removeEventListener('timeupdate', updateProgress);
        audio.removeEventListener('ended', () => {});
      };
    }
  }, [echo]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value) => {
    const audio = audioRef.current;
    const seekTime = (value / 100) * audio.duration;
    audio.currentTime = seekTime;
    setProgress(value);
  };

  const handleVolumeChange = (value) => {
    const audio = audioRef.current;
    audio.volume = value / 100;
    setVolume(value);
  };

  const handleSpeedChange = (speed) => {
    const audio = audioRef.current;
    audio.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleLike = async () => {
    if (echo) {
      const updatedEcho = { ...echo, likes: (echo.likes || 0) + 1 };
      await updateEcho(updatedEcho);
    }
  };

  return (
    <Dialog open={!!echo} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{echo?.title}</DialogTitle>
        </DialogHeader>
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
          <div className="flex items-center space-x-2">
            <Music className="h-5 w-5" />
            <select
              value={playbackSpeed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="border rounded p-1"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
            </select>
          </div>
        </div>
        <div className="flex justify-between">
          <Button variant="ghost" size="lg" onClick={handleLike}>
            <Heart className="h-6 w-6 mr-2" />
            Like ({echo?.likes || 0})
          </Button>
          <Button variant="ghost" size="lg">
            <Mic className="h-6 w-6 mr-2" />
            Reply
          </Button>
        </div>
        <EchoComments echoId={echo?.id} />
        <RelatedEchoes echoId={echo?.id} />
      </DialogContent>
    </Dialog>
  );
};

export default EchoPlaybackOverlay;