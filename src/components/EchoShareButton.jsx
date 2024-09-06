import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';

const EchoShareButton = ({ echoId }) => {
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/echo/${echoId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this Echo!',
        url: shareUrl,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleShare}>
      <Share2 className="h-5 w-5 mr-1" />
      Share
    </Button>
  );
};

export default EchoShareButton;