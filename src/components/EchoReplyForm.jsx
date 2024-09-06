import React, { useState } from 'react';
import { Button } from './ui/button';
import RecordButton from './RecordButton';

const EchoReplyForm = ({ onSubmit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);

  const handleRecordToggle = () => {
    if (isRecording) {
      // Stop recording logic
      setIsRecording(false);
      // Simulating a recorded audio blob
      setRecordedAudio(new Blob(['audio data'], { type: 'audio/webm' }));
    } else {
      // Start recording logic
      setIsRecording(true);
      setRecordedAudio(null);
    }
  };

  const handleSubmit = () => {
    if (recordedAudio) {
      onSubmit(recordedAudio);
      setRecordedAudio(null);
    }
  };

  return (
    <div className="space-y-4">
      <RecordButton isRecording={isRecording} onClick={handleRecordToggle} />
      {recordedAudio && (
        <Button onClick={handleSubmit} className="w-full">
          Submit Reply
        </Button>
      )}
    </div>
  );
};

export default EchoReplyForm;