import React, { useState, useRef, useEffect } from 'react';
import { Mic, Pause, Square, Play } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

const MAX_RECORDING_TIME = 60; // 1 minute in seconds

const AudioRecorder = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      const analyser = audioContextRef.current.createAnalyser();
      source.connect(analyser);

      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        onAudioRecorded(audioBlob, audioUrl);
        audioChunksRef.current = [];
      };
      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your browser settings.');
      return false;
    }
  };

  const toggleRecording = async () => {
    if (!isRecording) {
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) return;

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setIsPaused(false);
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => {
          if (prevTime >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime) => {
            if (prevTime >= MAX_RECORDING_TIME - 1) {
              stopRecording();
              return MAX_RECORDING_TIME;
            }
            return prevTime + 1;
          });
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        clearInterval(timerRef.current);
      }
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    setIsPaused(false);
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant={isRecording ? (isPaused ? 'outline' : 'destructive') : 'default'}
          size="lg"
          className="w-full"
          onClick={toggleRecording}
          disabled={recordingTime >= MAX_RECORDING_TIME}
        >
          {isRecording ? (isPaused ? <Play className="mr-2" /> : <Pause className="mr-2" />) : <Mic className="mr-2" />}
          {isRecording ? (isPaused ? 'Resume' : 'Pause') : 'Start Recording'}
        </Button>
      </div>
      {isRecording && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">{formatTime(recordingTime)}</span>
            <span className="text-sm font-medium">{formatTime(MAX_RECORDING_TIME)}</span>
          </div>
          <Progress value={(recordingTime / MAX_RECORDING_TIME) * 100} className="w-full" />
          <Button type="button" variant="outline" size="lg" className="w-full mt-2" onClick={stopRecording}>
            <Square className="mr-2" />
            Stop Recording
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;