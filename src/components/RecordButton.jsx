import React from 'react';
import { Mic } from 'lucide-react';
import { Button } from './ui/button';

const RecordButton = ({ isRecording, onClick }) => {
  return (
    <Button
      variant={isRecording ? 'destructive' : 'default'}
      size="lg"
      className="rounded-full w-16 h-16"
      onClick={onClick}
    >
      <Mic className={`h-8 w-8 ${isRecording ? 'animate-pulse' : ''}`} />
    </Button>
  );
};

export default RecordButton;