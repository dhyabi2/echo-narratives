import React, { useState } from 'react';
import { Mic, Pause, Square, Play, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addEcho, getTrendingTopics, addOrUpdateTopic } from '../lib/db';
import AudioRecorder from './AudioRecorder';
import TrendSelector from './TrendSelector';

const EchoCreationScreen = () => {
  const [title, setTitle] = useState('');
  const [trend, setTrend] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const navigate = useNavigate();

  const handleAudioRecorded = (blob, url) => {
    setAudioBlob(blob);
    setAudioUrl(url);
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
    if (!trend) {
      toast.error('Please select or add a trend for your echo.');
      return;
    }
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64AudioMessage = reader.result;
        const newEcho = await addEcho({
          title,
          trend,
          audioData: base64AudioMessage,
          likes: 0,
          replies: 0,
          shares: 0,
          createdAt: new Date().toISOString(),
        });
        await addOrUpdateTopic({ name: trend, echoCount: 1 });
        toast.success('Echo created successfully!');
        navigate('/', { replace: true });
      };
    } catch (error) {
      console.error('Error creating echo:', error);
      toast.error('Failed to create echo. Please try again.');
    }
  };

  return (
    <form onSubmit={saveEcho} className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Create New Echo</h2>
      <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}
      <div>
        <Label htmlFor="echo-title">Echo Title</Label>
        <Input id="echo-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter a title for your echo" />
      </div>
      <TrendSelector onTrendChange={setTrend} />
      <Button type="submit" className="w-full" disabled={!audioBlob || !title || !trend}>
        <Save className="mr-2" />
        Share Echo
      </Button>
    </form>
  );
};

export default EchoCreationScreen;