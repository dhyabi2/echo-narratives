import React, { useState, useEffect } from 'react';
import { Mic, Pause, Square, Play, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { addEcho, getCategories } from '../lib/db';
import { useNavigate } from 'react-router-dom';

const EchoCreationScreen = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [categories, setCategories] = useState([]);
  const [transcription, setTranscription] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const fetchedCategories = await getCategories();
      setCategories(fetchedCategories);
    };
    fetchCategories();
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      setIsPaused(!isPaused);
    } else {
      setIsRecording(true);
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    // Simulate transcription
    setTranscription("This is a simulated transcription of the recorded echo.");
  };

  const saveEcho = async () => {
    const newEcho = {
      title,
      category,
      duration: recordingTime,
      isAnonymous,
      transcription,
      createdAt: new Date().toISOString(),
    };
    await addEcho(newEcho);
    navigate('/');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create New Echo</h2>
      <div className="mb-4">
        <Button
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
          <Button variant="outline" size="lg" className="w-full" onClick={stopRecording}>
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
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
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
      <Button className="w-full" onClick={saveEcho}>
        <Save className="mr-2" />
        Share Echo
      </Button>
    </div>
  );
};

export default EchoCreationScreen;