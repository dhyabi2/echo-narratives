import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { updateComment, addReply } from '../lib/db';
import AudioPlayer from './AudioPlayer';
import ReplyForm from './ReplyForm';

const EchoComments = ({ comments, onReply, onShare }) => {
  const [replyingTo, setReplyingTo] = useState(null);

  const handleLike = async (commentId) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId
        ? { ...comment, likes: (comment.likes || 0) + 1 }
        : comment
    );
    const updatedComment = updatedComments.find(comment => comment.id === commentId);
    await updateComment(updatedComment);
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleSubmitReply = async (commentId, audioBlob) => {
    const newReply = await addReply(commentId, audioBlob);
    setReplyingTo(null);
    if (typeof onReply === 'function') {
      onReply(newReply);
    }
  };

  const renderComment = (comment, depth = 0) => (
    <motion.div
      key={comment.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{ marginLeft: `${depth * 20}px` }}
    >
      <Card className={`bg-gray-${50 + depth * 50} mb-2`}>
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <AudioPlayer src={comment.audioData} />
          <div className="flex justify-between mt-2">
            <Button variant="ghost" size="sm" onClick={() => handleLike(comment.id)}>
              <Heart className={`h-4 w-4 mr-1 ${comment.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-xs">{comment.likes || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => handleReply(comment.id)}>
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => typeof onShare === 'function' && onShare(comment.id)}>
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
          {replyingTo === comment.id && (
            <ReplyForm onSubmit={(audioBlob) => handleSubmitReply(comment.id, audioBlob)} />
          )}
        </CardContent>
      </Card>
      {comment.replies && comment.replies.map(reply => renderComment(reply, depth + 1))}
    </motion.div>
  );

  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-2 mt-4">
      {sortedComments.map(comment => renderComment(comment))}
      {comments.length === 0 && (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

export default EchoComments;