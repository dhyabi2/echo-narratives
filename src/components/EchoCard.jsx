import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Heart, Share2, Flag, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Slider } from './ui/slider';
import { updateEcho, getEchoById } from '../lib/db';
import { toast } from 'sonner';
import ShareEchoScreen from './ShareEchoScreen';
import ReportEchoModal from './ReportEchoModal';
import CommentModal from './CommentModal';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatDateInArabic } from '../utils/dateUtils';

const EchoCard = ({ echo, onEchoUpdated }) => {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(echo.isLiked || false);
  const [showShareScreen, setShowShareScreen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio(echo.audioData));

  useEffect(() => {
    const audio = audioRef.current;
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [echo.audioData]);

  const handleLike = async () => {
    try {
      const updatedEcho = await getEchoById(echo.id);
      updatedEcho.likes = isLiked ? updatedEcho.likes - 1 : updatedEcho.likes + 1;
      updatedEcho.isLiked = !isLiked;
      await updateEcho(updatedEcho);
      setIsLiked(!isLiked);
      onEchoUpdated(updatedEcho);
      toast.success(isLiked ? 'تم إلغاء الإعجاب بالصدى' : 'تم الإعجاب بالصدى');
    } catch (error) {
      console.error('Error updating like:', error);
      toast.error('حدث خطأ أثناء تحديث الإعجاب. يرجى المحاولة مرة أخرى.');
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast.error('حدث خطأ أثناء تشغيل الصوت. يرجى المحاولة مرة أخرى.');
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value) => {
    const audio = audioRef.current;
    audio.currentTime = value;
    setCurrentTime(value);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full mb-4">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar>
              <AvatarImage src={echo.authorAvatar} />
              <AvatarFallback>{echo.author ? echo.author[0] : 'م'}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{echo.title}</h3>
              <p className="text-sm text-gray-500">{formatDateInArabic(echo.createdAt)}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-4">{echo.content}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span className="ml-2">{isPlaying ? 'إيقاف' : 'تشغيل'}</span>
              </Button>
              <span className="text-sm text-gray-500">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={(value) => handleSeek(value[0])}
            />
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full grid grid-cols-4 gap-2">
            <Button variant="ghost" size="sm" onClick={handleLike}>
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="ml-1">{echo.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowCommentModal(true)}>
              <MessageCircle className="h-4 w-4" />
              <span className="ml-1">{echo.comments?.length || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowShareScreen(true)}>
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReportModal(true)}>
              <Flag className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      {showShareScreen && (
        <ShareEchoScreen echo={echo} onClose={() => setShowShareScreen(false)} />
      )}
      {showReportModal && (
        <ReportEchoModal echoId={echo.id} isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
      )}
      <CommentModal 
        echoId={echo.id} 
        isOpen={showCommentModal} 
        onClose={() => setShowCommentModal(false)} 
        onCommentAdded={(newComment) => {
          echo.comments = [...(echo.comments || []), newComment];
          onEchoUpdated(echo);
        }} 
      />
    </motion.div>
  );
};

export default EchoCard;