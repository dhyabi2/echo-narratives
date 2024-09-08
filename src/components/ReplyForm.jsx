import React, { useState } from 'react';
import { Button } from './ui/button';
import AudioRecorder from './AudioRecorder';

const ReplyForm = ({ onSubmit }) => {
  const [audioBlob, setAudioBlob] = useState(null);

  const handleAudioRecorded = (blob) => {
    setAudioBlob(blob);
  };

  const handleSubmit = () => {
    if (audioBlob) {
      onSubmit(audioBlob);
      setAudioBlob(null);
    }
  };

  return (
    <div className="mt-4">
      <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      {audioBlob && (
        <Button onClick={handleSubmit} className="mt-2">
          Submit Reply
        </Button>
      )}
    </div>
  );
};

export default ReplyForm;