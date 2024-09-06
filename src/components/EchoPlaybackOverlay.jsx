import React, { useState, useEffect, useRef } from 'react';
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
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio) {
      // Web API: Media Session API
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: echo.title,
          artist: echo.author || 'Anonymous',
          album: 'Echoes App',
        });

        navigator.mediaSession.setActionHandler('play', () => {
          audio.play();
          setIsPlaying(true);
        });

        navigator.mediaSession.setActionHandler('pause', () => {
          audio.pause();
          setIsPlaying(false);
        });

        navigator.mediaSession.setActionHandler('seekbackward', () => {
          audio.currentTime = Math.max(audio.currentTime - 10, 0);
        });

        navigator.mediaSession.setActionHandler('seekforward', () => {
          audio.currentTime = Math.min(audio.currentTime + 10, audio.duration);
        });
      }

      // Web API: Web Audio API for visualizations
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audio);
      const analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // Update progress
      audio.addEventListener('timeupdate', () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      });

      // Playback ended
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setProgress(0);
      });

      return () => {
        audio.removeEventListener('timeupdate', () => {});
        audio.removeEventListener('ended', () => {});
        audioContext.close();
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={onClose}>
          <X className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-bold mb-4">{echo.title}</h2>
        <p className="text-gray-500 mb-4">{echo.category}</p>
        <audio ref={audioRef} src={echo.audioUrl} />
        <AudioWaveform progress={progress} />
        <Slider value={[progress]} max={100} step={1} onValueChange={(value) => handleSeek(value[0])} className="mb-4" />
        <div className="flex justify-between items-center mb-4">
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
        <div className="flex items-center mb-4">
          <Volume2 className="h-5 w-5 mr-2" />
          <Slider
            value={[volume]}
            max={100}
            step={1}
            onValueChange={(value) => handleVolumeChange(value[0])}
            className="w-full"
          />
        </div>
        <div className="flex items-center mb-4">
          <Music className="h-5 w-5 mr-2" />
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