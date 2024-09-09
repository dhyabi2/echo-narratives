import React, { useState } from 'react';
import { Mic, Pause, Square, Play, Save } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import AudioRecorder from './AudioRecorder';

const VoiceCommentForm = ({ onCommentAdded }) => {
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleAudioRecorded = (blob, url) => {
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  const handleSubmit = () => {
    if (audioBlob) {
      onCommentAdded(audioBlob);
      setAudioBlob(null);
      setAudioUrl(null);
      toast.success('تم إضافة التعليق الصوتي بنجاح!');
    } else {
      toast.error('الرجاء تسجيل تعليق صوتي قبل الإرسال.');
    }
  };

  return (
    <div className="space-y-4">
      <AudioRecorder onAudioRecorded={handleAudioRecorded} />
      {audioUrl && (
        <div>
          <audio src={audioUrl} controls className="w-full" />
        </div>
      )}
      <Button onClick={handleSubmit} disabled={!audioBlob} className="w-full">
        <Save className="mr-2 h-4 w-4" />
        إرسال التعليق الصوتي
      </Button>
    </div>
  );
};

export default VoiceCommentForm;