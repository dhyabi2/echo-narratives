import React from 'react';
import { Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const EchoShareButton = ({ echo }) => {
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/echo/${echo.id}`;
    const shareData = {
      title: 'Check out this Echo!',
      text: echo.title,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('Echo shared successfully!');
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing echo:', error);
      toast.error('Failed to share echo. Please try again.');
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