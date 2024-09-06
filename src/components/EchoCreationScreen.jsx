import React, { useState, useEffect, useRef } from 'react';
import { Mic, Pause, Square, Play, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addEcho, getCategories } from '../utils/localStorage';

const EchoCreationScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [categories, setCategories] = useState([]);
  const [transcription, setTranscription] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const navigate = useNavigate();

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        audioChunksRef.current = [];
      };
      return true;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Unable to access microphone. Please check your browser settings.');
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
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingTime((prevTime) => prevTime + 1);
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
    // Simulate transcription
    setTranscription("This is a simulated transcription of the recorded echo.");
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const saveEcho = (e) => {
    e.preventDefault();
    if (!audioBlob) {
      toast.error('Please record an echo before saving.');
      return;
    }
    try {
      const newEcho = addEcho({
        title,
        category,
        duration: recordingTime,
        isAnonymous,
        transcription,
        audioBlob,
        likes: 0,
        replies: 0,
        shares: 0
      });
      toast.success('Echo created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Error creating echo:', error);
      toast.error('Failed to create echo. Please try again.');
    }
  };

  return (
    <form onSubmit={saveEcho} className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Echo</h2>
      <div className="mb-4">
        <Button
          type="button"
          variant={isRecording ? (isPaused ? 'outline' : 'destructive') : 'default'}
          size="lg"
          className="w-full"
          onClick={toggleRecording}
        >
          {isRecording ? (isPaused ? <Play className="mr-2" /> : <Pause className="mr-2" />) : <Mic className="mr-2" />}
          {isRecording ? (isPaused ? 'Resume' : 'Pause') : 'Start Recording'}
        </Button>
      </div>
      {isRecording && (
        <div className="mb-4">
          <p className="text-center font-semibold">{formatTime(recordingTime)}</p>
          <Button type="button" variant="outline" size="lg" className="w-full mt-2" onClick={stopRecording}>
            <Square className="mr-2" />
            Stop Recording
          </Button>
        </div>
      )}
      <div className="mb-4">
        <Label htmlFor="echo-title">Echo Title</Label>
        <Input id="echo-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title for your echo" />
      </div>
      <div className="mb-4">
        <Label htmlFor="echo-category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="echo-category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between mb-4">
        <Label htmlFor="anonymous-toggle">Post Anonymously</Label>
        <Switch id="anonymous-toggle" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
      </div>
      {transcription && (
        <div className="mb-4">
          <Label htmlFor="transcription">Transcription</Label>
          <textarea
            id="transcription"
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="w-full h-32 p-2 border rounded"
          />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={!audioBlob}>
        <Save className="mr-2" />
        Share Echo
      </Button>
    </form>
  );
};

export default EchoCreationScreen;