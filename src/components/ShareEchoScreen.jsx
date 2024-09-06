import React from 'react';
import { Share2, Copy, Instagram, Twitter } from 'lucide-react';
import { Button } from './ui/button';

const ShareEchoScreen = ({ echo, onClose }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://echoes.app/echo/${echo.id}`);
    // You might want to show a toast notification here
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Share Echo</h2>
      <p className="mb-4">"{echo.title}"</p>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button variant="outline" className="flex items-center justify-center">
          <Instagram className="h-5 w-5 mr-2" />
          Instagram
        </Button>
        <Button variant="outline" className="flex items-center justify-center">
          <Twitter className="h-5 w-5 mr-2" />
          Twitter
        </Button>
        {/* Add more social media buttons as needed */}
      </div>
      <Button variant="default" className="w-full mb-2" onClick={handleCopyLink}>
        <Copy className="h-5 w-5 mr-2" />
        Copy Link
      </Button>
      <Button variant="ghost" className="w-full" onClick={onClose}>
        Cancel
      </Button>
    </div>
  );
};

export default ShareEchoScreen;