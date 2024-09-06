import React from 'react';
import { Play, Heart, Share2, Flag, Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import EchoReactions from './EchoReactions';
import EchoMetadata from './EchoMetadata';
import EchoTags from './EchoTags';
import { updateEcho } from '../utils/localStorage';
import { toast } from 'sonner';

const EchoCard = ({ echo, onPlay }) => {
  const handleShare = () => {
    const newShareCount = echo.shares + 1;
    updateEcho({ ...echo, shares: newShareCount });
    toast.success('Echo shared successfully!');
  };

  const handleReport = () => {
    toast.info('Echo reported. Our team will review it.');
  };

  const handleBookmark = () => {
    toast.success('Echo bookmarked!');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{echo.title}</h3>
      <EchoMetadata duration={echo.duration} category={echo.category} createdAt={echo.createdAt} />
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={() => onPlay(echo)}>
          <Play className="h-4 w-4" />
        </Button>
        <EchoReactions echo={echo} />
      </div>
      <EchoTags tags={echo.tags || []} />
      <div className="flex justify-between items-center mt-4">
        <Button variant="ghost" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
        <Button variant="ghost" size="sm" onClick={handleReport}>
          <Flag className="h-4 w-4 mr-1" />
          Report
        </Button>
        <Button variant="ghost" size="sm" onClick={handleBookmark}>
          <Bookmark className="h-4 w-4 mr-1" />
          Bookmark
        </Button>
      </div>
    </div>
  );
};

export default EchoCard;