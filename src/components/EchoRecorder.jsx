import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Mic, Square, Play } from 'lucide-react';

const EchoRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks = [];
    mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      setAudioBlob(blob);
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleSave = () => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  };

  return (
    <div className="space-y-4">
      {!isRecording && !audioBlob && (
        <Button onClick={startRecording}>
          <Mic className="mr-2 h-4 w-4" /> Start Recording
        </Button>
      )}
      {isRecording && (
        <Button onClick={stopRecording}>
          <Square className="mr-2 h-4 w-4" /> Stop Recording
        </Button>
      )}
      {audioBlob && (
        <>
          <audio src={URL.createObjectURL(audioBlob)} controls />
          <Button onClick={handleSave}>
            <Play className="mr-2 h-4 w-4" /> Save Echo
          </Button>
        </>
      )}
    </div>
  );
};

export default EchoRecorder;