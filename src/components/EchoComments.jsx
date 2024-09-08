import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from './ui/button';

const EchoComments = ({ comments: initialComments = [], onReply, onShare }) => {
  const [comments, setComments] = useState(initialComments);

  const handleLike = (commentId) => {
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: (comment.likes || 0) + 1 }
          : comment
      )
    );
  };

  // Sort comments by likes in descending order
  const sortedComments = [...comments].sort((a, b) => (b.likes || 0) - (a.likes || 0));

  return (
    <div className="space-y-4 mt-4">
      <AnimatePresence>
        {sortedComments.map((comment) => (
          <motion.div
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-gray-50">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={comment.authorAvatar} />
                    <AvatarFallback>{comment.author ? comment.author[0] : 'A'}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{comment.author || 'Anonymous User'}</span>
                </div>
                <AudioPlayer src={comment.audioData} />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex justify-between mt-2">
                  <Button variant="ghost" size="sm" onClick={() => handleLike(comment.id)}>
                    <Heart className={`h-4 w-4 mr-1 ${comment.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                    {comment.likes || 0}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onReply(comment.id)}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onShare(comment.id)}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
      {comments.length === 0 && (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

export default EchoComments;