import React, { useState } from 'react';
import { Play, Heart, Share2, Flag, Bookmark, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { updateEcho, getEchoById } from '../lib/db';
import { toast } from 'sonner';
import EchoPlaybackOverlay from './EchoPlaybackOverlay';
import ShareEchoScreen from './ShareEchoScreen';
import ReportEchoModal from './ReportEchoModal';
import { Badge } from './ui/badge';

const EchoCard = ({ echo, onEchoUpdated }) => {
  const [isLiked, setIsLiked] = useState(echo.isLiked || false);
  const [isBookmarked, setIsBookmarked] = useState(echo.isBookmarked || false);
  const [showPlayback, setShowPlayback] = useState(false);
  const [showShareScreen, setShowShareScreen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

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
    const updatedEcho = await getEchoById(echo.id);
    updatedEcho.isBookmarked = !isBookmarked;
    await updateEcho(updatedEcho);
    setIsBookmarked(!isBookmarked);
    onEchoUpdated(updatedEcho);
    toast.success(isBookmarked ? 'Echo removed from bookmarks' : 'Echo bookmarked');
  };

  const handlePlay = () => {
    setShowPlayback(true);
  };

  const handleShare = () => {
    setShowShareScreen(true);
  };

  const handleReport = () => {
    setShowReportModal(true);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
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
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{echo.content}</p>
          <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
            <span>{echo.duration}</span>
            <span>•</span>
            <Badge variant="secondary">{echo.trend}</Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handlePlay}>
              <Play className="h-4 w-4 mr-1" />
              Play
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLike}>
              <Heart className={`h-4 w-4 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
              {echo.likes}
            </Button>
            <Button variant="ghost" size="sm">
              <MessageCircle className="h-4 w-4 mr-1" />
              {echo.replies || 0}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Button variant="ghost" size="sm" onClick={handleBookmark}>
              <Bookmark className={`h-4 w-4 mr-1 ${isBookmarked ? 'fill-current text-blue-500' : ''}`} />
              Save
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReport}>
              <Flag className="h-4 w-4 mr-1" />
              Report
            </Button>
          </div>
        </CardFooter>
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
    </>
  );
};

export default EchoCard;