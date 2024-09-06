import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const EchoPlaybackSpeed = ({ onSpeedChange }) => {
  const [speed, setSpeed] = useState('1');

  const handleSpeedChange = (value) => {
    setSpeed(value);
    onSpeedChange(parseFloat(value));
  };

  return (
    <Select value={speed} onValueChange={handleSpeedChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Speed" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="0.5">0.5x</SelectItem>
        <SelectItem value="0.75">0.75x</SelectItem>
        <SelectItem value="1">1x</SelectItem>
        <SelectItem value="1.25">1.25x</SelectItem>
        <SelectItem value="1.5">1.5x</SelectItem>
        <SelectItem value="2">2x</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default EchoPlaybackSpeed;