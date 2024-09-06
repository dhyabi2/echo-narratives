import React from 'react';
import { Button } from './ui/button';
import { Share2, Twitter, Facebook, Link } from 'lucide-react';

const ShareEcho = ({ echoId }) => {
  const shareUrl = `https://yourapp.com/echo/${echoId}`;

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // You might want to show a toast notification here
  };

  return (
    <div className="flex space-x-2">
      <Button onClick={shareToTwitter}>
        <Twitter className="mr-2 h-4 w-4" /> Twitter
      </Button>
      <Button onClick={shareToFacebook}>
        <Facebook className="mr-2 h-4 w-4" /> Facebook
      </Button>
      <Button onClick={copyLink}>
        <Link className="mr-2 h-4 w-4" /> Copy Link
      </Button>
    </div>
  );
};

export default ShareEcho;