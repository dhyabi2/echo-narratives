import React, { useState, useEffect } from 'react';
import { Mic, Pause, Square, Play, Save, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { addEcho, getUserSettings, updateUserSettings } from '../lib/db';
import AudioRecorder from './AudioRecorder';
import { useCountry } from '../contexts/CountryContext';

const EchoCreationScreen = () => {
  const [title, setTitle] = useState('');
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [recorderName, setRecorderName] = useState('');
  const [showRecorderName, setShowRecorderName] = useState(false);
  const [saveRecorderName, setSaveRecorderName] = useState(false);
  const navigate = useNavigate();
  const { country } = useCountry();

  useEffect(() => {
    const loadUserSettings = async () => {
      const settings = await getUserSettings();
      if (settings && settings.recorderName) {
        setRecorderName(settings.recorderName);
        setShowRecorderName(true);
        setSaveRecorderName(true);
      }
    };
    loadUserSettings();
  }, []);

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
        const newEcho = await addEcho({
          title,
          audioData: base64AudioMessage,
          likes: 0,
          replies: 0,
          shares: 0,
          country,
          createdAt: new Date().toISOString(),
          recorderName: showRecorderName ? recorderName : null,
        });
        if (saveRecorderName) {
          await updateUserSettings({ recorderName });
        }
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
      <div className="flex items-center space-x-2">
        <Switch
          id="show-recorder-name"
          checked={showRecorderName}
          onCheckedChange={setShowRecorderName}
        />
        <Label htmlFor="show-recorder-name">إظهار اسم المسجل</Label>
      </div>
      {showRecorderName && (
        <div>
          <Label htmlFor="recorder-name">اسم المسجل</Label>
          <Input
            id="recorder-name"
            value={recorderName}
            onChange={(e) => setRecorderName(e.target.value)}
            placeholder="أدخل اسمك (اختياري)"
          />
        </div>
      )}
      <div className="flex items-center space-x-2">
        <Switch
          id="save-recorder-name"
          checked={saveRecorderName}
          onCheckedChange={setSaveRecorderName}
        />
        <Label htmlFor="save-recorder-name">حفظ اسم المسجل للتسجيلات المستقبلية</Label>
      </div>
      <Button type="submit" className="w-full" disabled={!audioBlob || !title}>
        <Save className="mr-2" />
        مشاركة الاعتراف
      </Button>
    </form>
  );
};

export default EchoCreationScreen;