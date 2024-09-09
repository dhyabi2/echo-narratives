import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import VoiceCommentForm from './VoiceCommentForm';
import { addComment } from '../lib/db';
import { v4 as uuidv4 } from 'uuid';

const CommentModal = ({ echoId, isOpen, onClose, onCommentAdded }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentAdded = async (audioBlob) => {
    setIsSubmitting(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64AudioData = reader.result;
        const newComment = {
          id: uuidv4(),
          echoId,
          audioData: base64AudioData,
          author: 'Anonymous User', // Replace with actual user data when available
          createdAt: new Date().toISOString(),
          likes: 0,
        };
        await addComment(echoId, newComment);
        onCommentAdded(newComment);
        onClose();
      };
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة تعليق صوتي</DialogTitle>
        </DialogHeader>
        <VoiceCommentForm onCommentAdded={handleCommentAdded} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  );
};

export default CommentModal;