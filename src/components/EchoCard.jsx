import React, { useState } from 'react';
import { Play, Heart, Share2, Flag, Bookmark, Hash } from 'lucide-react';
import { Button } from './ui/button';
import EchoReactions from './EchoReactions';
import EchoMetadata from './EchoMetadata';
import EchoTags from './EchoTags';
import EchoPlaybackOverlay from './EchoPlaybackOverlay';

const EchoCard = ({ echo }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleShare = () => {
    // Implement sharing functionality
    console.log('Sharing echo:', echo.id);
  };

  const handleReport = () => {
    // Implement reporting functionality
    console.log('Reporting echo:', echo.id);
  };

  const handleBookmark = () => {
    // Implement bookmarking functionality
    console.log('Bookmarking echo:', echo.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{echo.title}</h3>
      <EchoMetadata duration={echo.duration} category={echo.category} createdAt={echo.createdAt} />
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={handlePlay}>
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
      {isPlaying && (
        <EchoPlaybackOverlay echo={echo} onClose={() => setIsPlaying(false)} />
      )}
    </div>
  );
};

export default EchoCard;