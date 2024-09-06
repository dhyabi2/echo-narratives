import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { addEchoReply } from '../lib/db';

const EchoReplyButton = ({ echoId, onReplyAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReply = async () => {
    if (replyContent.trim()) {
      const newReply = await addEchoReply(echoId, replyContent);
      onReplyAdded(newReply);
      setIsOpen(false);
      setReplyContent('');
    }
  };

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)}>
        <MessageCircle className="h-5 w-5 mr-1" />
        Reply
      </Button>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Echo</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Your reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleReply}>Post Reply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EchoReplyButton;