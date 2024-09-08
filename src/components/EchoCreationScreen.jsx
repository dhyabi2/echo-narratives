import React, { useState } from 'react';
import { Mic, Pause, Square, Play, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addEcho } from '../lib/db';
import AudioRecorder from './AudioRecorder';
import { useCountry } from '../contexts/CountryContext';

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
      toast.error('الرجاء تسجيل صدى قبل الحفظ.');
      return;
    }
    if (!title) {
      toast.error('الرجاء إدخال عنوان للصدى الخاص بك.');
      return;
    }
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64AudioMessage = reader.result;
        const newEcho = await addEcho({
          title,
          audioData: base64AudioMessage,
          likes: 0,
          replies: 0,
          shares: 0,
          country,
          createdAt: new Date().toISOString(),
        });
        toast.success('تم إنشاء الصدى بنجاح!');
        navigate('/', { replace: true });
      };
    } catch (error) {
      console.error('خطأ في إنشاء الصدى:', error);
      toast.error('فشل في إنشاء الصدى. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <form onSubmit={saveEcho} className="p-4 space-y-4">
      <h2 className="text-2xl font-bold mb-4">إنشاء صدى جديد</h2>
      <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}
      <div>
        <Label htmlFor="echo-title">عنوان الصدى</Label>
        <Input id="echo-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="أدخل عنوانًا للصدى الخاص بك" />
      </div>
      <Button type="submit" className="w-full" disabled={!audioBlob || !title}>
        <Save className="mr-2" />
        مشاركة الصدى
      </Button>
    </form>
  );
};

export default EchoCreationScreen;