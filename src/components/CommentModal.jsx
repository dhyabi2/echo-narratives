import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import VoiceCommentForm from './VoiceCommentForm';

const CommentModal = ({ echoId, isOpen, onClose }) => {
  const handleCommentAdded = (comment) => {
    // Here you would typically update the echo with the new comment
    console.log('New comment added:', comment);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Voice Comment</DialogTitle>
        </DialogHeader>
        <VoiceCommentForm onCommentAdded={handleCommentAdded} echoId={echoId} />
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;