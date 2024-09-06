import React, { useState, useEffect, useRef } from 'react';
import { Mic, Pause, Square, Play, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addEcho, getCategories } from '../lib/db';

const EchoCreationScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [categories, setCategories] = useState([]);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const navigate = useNavigate();

  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };
    fetchCategories();

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
        setAudioBlob(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
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
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const saveEcho = async (e) => {
    e.preventDefault();
    if (!audioBlob) {
      toast.error('Please record an echo before saving.');
      return;
    }
    if (!title) {
      toast.error('Please enter a title for your echo.');
      return;
    }
    if (!category) {
      toast.error('Please select a category for your echo.');
      return;
    }
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64AudioMessage = reader.result;
        const newEcho = await addEcho({
          title,
          category,
          duration: formatTime(recordingTime),
          isAnonymous,
          audioData: base64AudioMessage,
          likes: 0,
          replies: 0,
          shares: 0,
          createdAt: new Date().toISOString(),
        });
        toast.success('Echo created successfully!');
        navigate('/');
      };
    } catch (error) {
      console.error('Error creating echo:', error);
      toast.error('Failed to create echo. Please try again.');
    }
  };

  return (
    <form onSubmit={saveEcho} className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create New Echo</h2>
      <div>
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
        <div>
          <p className="text-center font-semibold">{formatTime(recordingTime)}</p>
          <Button type="button" variant="outline" size="lg" className="w-full mt-2" onClick={stopRecording}>
            <Square className="mr-2" />
            Stop Recording
          </Button>
        </div>
      )}
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}
      <div>
        <Label htmlFor="echo-title">Echo Title</Label>
        <Input id="echo-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title for your echo" />
      </div>
      <div>
        <Label htmlFor="echo-category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="echo-category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="anonymous-toggle">Post Anonymously</Label>
        <Switch id="anonymous-toggle" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
      </div>
      <Button type="submit" className="w-full" disabled={!audioBlob || !title || !category}>
        <Save className="mr-2" />
        Share Echo
      </Button>
    </form>
  );
};

export default EchoCreationScreen;