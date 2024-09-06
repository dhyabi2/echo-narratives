import React, { useState } from 'react';
import { Volume, VolumeX } from 'lucide-react';
import { Slider } from './ui/slider';

const EchoVolumeControl = ({ onVolumeChange }) => {
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    onVolumeChange(isMuted ? 0 : newVolume);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    onVolumeChange(isMuted ? volume : 0);
  };

  return (
    <div className="flex items-center space-x-2">
      <button onClick={toggleMute}>
        {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume className="h-5 w-5" />}
      </button>
      <Slider
        value={[volume]}
        max={100}
        step={1}
        onValueChange={(value) => handleVolumeChange(value[0])}
        className="w-24"
      />
    </div>
  );
};

export default EchoVolumeControl;