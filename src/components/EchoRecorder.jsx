import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Mic, Square, Play } from 'lucide-react';
import { addEcho } from '../lib/db';

const EchoRecorder = () => {
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

  const handleSave = async () => {
    if (audioBlob) {
      const echo = {
        title: 'New Echo', // You might want to add a title input field
        audioUrl: URL.createObjectURL(audioBlob),
        duration: '0:30', // You should calculate the actual duration
        likes: 0,
        createdAt: new Date().toISOString(),
      };
      await addEcho(echo);
      setAudioBlob(null);
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