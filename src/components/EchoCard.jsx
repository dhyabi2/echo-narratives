import React, { useState, useRef } from 'react';
import { Play, Pause, Heart, Share2, Flag, Bookmark, MessageCircle, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Slider } from './ui/slider';
import { updateEcho, getEchoById, addBookmark, removeBookmark, getComments, addComment } from '../lib/db';
import { toast } from 'sonner';
import ShareEchoScreen from './ShareEchoScreen';
import ReportEchoModal from './ReportEchoModal';
import CommentModal from './CommentModal';
import EchoComments from './EchoComments';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { formatDateInArabic } from '../utils/dateUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const EchoCard = ({ echo, onEchoUpdated }) => {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(echo.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(echo.isBookmarked || false);
  const [showShareScreen, setShowShareScreen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio(echo.audioData));

  React.useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(echo.id);
      setComments(fetchedComments);
    };
    fetchComments();

    const audio = audioRef.current;
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadedmetadata', () => {});
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('ended', () => {});
    };
  }, [echo.id, echo.audioData]);

  const handleLike = async () => {
    const updatedEcho = await getEchoById(echo.id);
    updatedEcho.likes = isLiked ? updatedEcho.likes - 1 : updatedEcho.likes + 1;
    updatedEcho.isLiked = !isLiked;
    await updateEcho(updatedEcho);
    setIsLiked(!isLiked);
    onEchoUpdated(updatedEcho);
    toast.success(isLiked ? 'تم إلغاء الإعجاب بالصدى' : 'تم الإعجاب بالصدى');
  };

  const handleBookmark = async () => {
    if (isBookmarked) {
      await removeBookmark(echo.id);
    } else {
      await addBookmark({ echoId: echo.id });
    }
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'تمت إزالة الصدى من المحفوظات' : 'تم حفظ الصدى');
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

  const handleShare = () => setShowShareScreen(true);
  const handleReport = () => setShowReportModal(true);
  const handleComment = () => setShowCommentModal(true);

  const handleCommentAdded = async (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
    setShowCommentModal(false);
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
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={echo.authorAvatar} />
                <AvatarFallback>{echo.author ? echo.author[0] : 'م'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{echo.title}</CardTitle>
                <p className="text-sm text-gray-500">{formatDateInArabic(echo.createdAt)}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleBookmark}>
                  <Bookmark className={`h-4 w-4 ml-2 ${isBookmarked ? 'fill-current text-blue-500' : ''}`} />
                  {isBookmarked ? 'إلغاء الحفظ' : 'حفظ'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="h-4 w-4 ml-2" />
                  إبلاغ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{echo.content}</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="sm" onClick={togglePlayPause}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
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
            <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center justify-center">
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="ml-1">{echo.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleComment} className="flex items-center justify-center">
              <MessageCircle className="h-4 w-4" />
              <span className="ml-1">{comments.length}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center justify-center">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
        <div className="px-4 pb-4">
          <EchoComments echoId={echo.id} comments={comments} onCommentAdded={handleCommentAdded} />
        </div>
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
        onCommentAdded={handleCommentAdded} 
      />
    </motion.div>
  );
};

export default EchoCard;