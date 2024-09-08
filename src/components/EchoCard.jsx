import React, { useState, useEffect } from 'react';
import { Play, Heart, Share2, Flag, Bookmark, MessageCircle, MoreVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { updateEcho, getEchoById, addBookmark, removeBookmark } from '../lib/db';
import { toast } from 'sonner';
import EchoPlaybackOverlay from './EchoPlaybackOverlay';
import ShareEchoScreen from './ShareEchoScreen';
import ReportEchoModal from './ReportEchoModal';
import CommentModal from './CommentModal';
import EchoComments from './EchoComments';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const EchoCard = ({ echo, onEchoUpdated }) => {
  const [isLiked, setIsLiked] = useState(echo.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(echo.isBookmarked || false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [showShareScreen, setShowShareScreen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const updatedEcho = await getEchoById(echo.id);
      setComments(updatedEcho?.comments || []);
    };
    fetchComments();
  }, [echo.id]);

  const handleLike = async () => {
    const updatedEcho = await getEchoById(echo.id);
    updatedEcho.likes = isLiked ? updatedEcho.likes - 1 : updatedEcho.likes + 1;
    updatedEcho.isLiked = !isLiked;
    await updateEcho(updatedEcho);
    setIsLiked(!isLiked);
    onEchoUpdated(updatedEcho);
    toast.success(isLiked ? 'Echo unliked' : 'Echo liked');
  };

  const handleBookmark = async () => {
    if (isBookmarked) {
      await removeBookmark(echo.id);
    } else {
      await addBookmark({ echoId: echo.id });
    }
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Echo removed from bookmarks' : 'Echo bookmarked');
  };

  const handlePlay = () => setShowPlayback(true);
  const handleShare = () => setShowShareScreen(true);
  const handleReport = () => setShowReportModal(true);
  const handleComment = () => setShowCommentModal(true);

  const handleCommentAdded = (newComment) => {
    setComments((prevComments) => [newComment, ...prevComments]);
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
                <AvatarFallback>{echo.author ? echo.author[0] : 'A'}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{echo.title}</CardTitle>
                <p className="text-sm text-gray-500">{new Date(echo.createdAt).toLocaleDateString()}</p>
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
                  <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current text-blue-500' : ''}`} />
                  {isBookmarked ? 'Unsave' : 'Save'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleReport}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{echo.content}</p>
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
            <span>{echo.duration}</span>
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full grid grid-cols-4 gap-2">
            <Button variant="ghost" size="sm" onClick={handlePlay} className="flex items-center justify-center">
              <Play className="h-4 w-4 mr-1" />
              Play
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center justify-center">
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {echo.likes}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleComment} className="flex items-center justify-center">
              <MessageCircle className="h-4 w-4 mr-1" />
              {comments.length}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center justify-center">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
        </CardFooter>
        <div className="px-4 pb-4">
          <EchoComments echoId={echo.id} comments={comments} onCommentAdded={handleCommentAdded} />
        </div>
      </Card>
      {showPlayback && (
        <EchoPlaybackOverlay echo={echo} onClose={() => setShowPlayback(false)} />
      )}
      {showShareScreen && (
        <ShareEchoScreen echo={echo} onClose={() => setShowShareScreen(false)} />
      )}
      {showReportModal && (
        <ReportEchoModal echoId={echo.id} isOpen={showReportModal} onClose={() => setShowReportModal(false)} />
      )}
      {showCommentModal && (
        <CommentModal echoId={echo.id} isOpen={showCommentModal} onClose={() => setShowCommentModal(false)} onCommentAdded={handleCommentAdded} />
      )}
    </motion.div>
  );
};

export default EchoCard;