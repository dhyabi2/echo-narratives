import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Share2, Copy, Twitter, Facebook, WhatsApp } from 'lucide-react';

const ShareEchoModal = ({ isOpen, onClose, echo }) => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://echoes.app/echo/${echo.id}`);
    // You might want to show a toast notification here
  };

  const handleSharePlatform = (platform) => {
    // Implement sharing logic for each platform
    console.log(`Sharing to ${platform}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Echo</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <h3 className="font-semibold mb-2">{echo.title}</h3>
          <p className="text-sm text-gray-500 mb-4">Share this echo with your friends!</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button variant="outline" onClick={() => handleSharePlatform('Twitter')}>
              <Twitter className="h-5 w-5 mr-2" />
              Twitter
            </Button>
            <Button variant="outline" onClick={() => handleSharePlatform('Facebook')}>
              <Facebook className="h-5 w-5 mr-2" />
              Facebook
            </Button>
            <Button variant="outline" onClick={() => handleSharePlatform('WhatsApp')}>
              <WhatsApp className="h-5 w-5 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline" onClick={handleCopyLink}>
              <Copy className="h-5 w-5 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareEchoModal;