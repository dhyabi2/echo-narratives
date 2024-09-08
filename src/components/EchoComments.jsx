import React from 'react';
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { updateComment } from '../lib/db';
import AudioPlayer from './AudioPlayer';

const EchoComments = ({ comments, onReply, onShare }) => {
  const handleLike = async (commentId) => {
    const updatedComments = comments.map(comment =>
      comment.id === commentId
        ? { ...comment, likes: (comment.likes || 0) + 1 }
        : comment
    );
    const updatedComment = updatedComments.find(comment => comment.id === commentId);
    await updateComment(updatedComment);
  };

  const sortedComments = [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="space-y-1 mt-2">
      {sortedComments.map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gray-50">
            <CardContent className="p-1">
              <div className="flex items-center space-x-1 mb-1">
                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <AudioPlayer src={comment.audioData} />
              <div className="flex justify-between mt-1">
                <Button variant="ghost" size="sm" onClick={() => handleLike(comment.id)}>
                  <Heart className={`h-3 w-3 mr-1 ${comment.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="text-xs">{comment.likes || 0}</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onReply(comment.id)}>
                  <MessageCircle className="h-3 w-3 mr-1" />
                  <span className="text-xs">Reply</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onShare(comment.id)}>
                  <Share2 className="h-3 w-3 mr-1" />
                  <span className="text-xs">Share</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      {comments.length === 0 && (
        <p className="text-xs text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

export default EchoComments;