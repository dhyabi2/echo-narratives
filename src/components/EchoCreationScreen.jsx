import React, { useState } from 'react';
import axios from 'axios';
import { Mic, Pause, Square, Play, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AudioRecorder from './AudioRecorder';
import { useCountry } from '../contexts/CountryContext';

const API_BASE_URL = 'https://ekos-api.replit.app';

const EchoCreationScreen = () => {
  const [title, setTitle] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const navigate = useNavigate();
  const { country } = useCountry();

  const handleAudioRecorded = (blob, url) => {
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  const saveEcho = async (e) => {
    e.preventDefault();
    if (!audioBlob) {
      toast.error('الرجاء تسجيل اعتراف قبل الحفظ.');
      return;
    }
    if (!title) {
      toast.error('الرجاء إدخال عنوان للاعتراف الخاص بك.');
      return;
    }
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64AudioMessage = reader.result;
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/echoes`, {
          title,
          audioData: base64AudioMessage,
          country,
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('تم إنشاء الاعتراف بنجاح!');
        navigate('/', { replace: true });
      };
    } catch (error) {
      console.error('خطأ في إنشاء الاعتراف:', error);
      toast.error('فشل في إنشاء الاعتراف. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <form onSubmit={saveEcho} className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">إنشاء اعتراف جديد</h2>
      <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}
      <div>
        <Label htmlFor="echo-title">عنوان الاعتراف</Label>
        <Input id="echo-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="أدخل عنوانًا للاعتراف الخاص بك" />
      </div>
      <Button type="submit" className="w-full" disabled={!audioBlob || !title}>
        <Save className="mr-2" />
        مشاركة الاعتراف
      </Button>
    </form>
  );
};

export default EchoCreationScreen;
