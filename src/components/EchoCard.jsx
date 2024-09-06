import React, { useState } from 'react';
import { Play, Heart, Share2, Flag, Bookmark, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { updateEcho } from '../utils/localStorage';
import { toast } from 'sonner';

const EchoCard = ({ echo, onPlay, onShare }) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    const newLikeCount = echo.likes + (isLiked ? -1 : 1);
    updateEcho({ ...echo, likes: newLikeCount });
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Echo unliked' : 'Echo liked');
  };

  const handleBookmark = () => {
    toast.success('Echo bookmarked');
  };

  const handleReport = () => {
    toast.info('Echo reported. Our team will review it.');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={echo.authorAvatar} />
            <AvatarFallback>{echo.author ? echo.author[0] : 'A'}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{echo.title}</CardTitle>
            <p className="text-sm text-gray-500">{echo.author || 'Anonymous'} • {new Date(echo.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700">{echo.content}</p>
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-500">
          <span>{echo.duration}</span>
          <span>•</span>
          <span>{echo.category}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onPlay(echo)}>
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
          <Button variant="ghost" size="sm" onClick={() => onShare(echo)}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="ghost" size="sm" onClick={handleBookmark}>
            <Bookmark className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="ghost" size="sm" onClick={handleReport}>
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EchoCard;