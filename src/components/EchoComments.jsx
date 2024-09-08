import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from './ui/button';
import { updateComment, addComment } from '../lib/db';
import AudioPlayer from './AudioPlayer';
import VoiceCommentForm from './VoiceCommentForm';

const CommentItem = ({ comment, depth = 0, onReply, onLike, onShare }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (audioBlob) => {
    onReply(comment.id, audioBlob);
    setShowReplyForm(false);
  };

  return (
    <div className={`ml-${depth * 4} mb-2`}>
      <Card className={`bg-gray-${50 + depth * 50}`}>
        <CardContent className="p-2">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <AudioPlayer src={comment.audioData} />
          <div className="flex justify-between mt-2">
            <Button variant="ghost" size="sm" onClick={() => onLike(comment.id)}>
              <Heart className={`h-4 w-4 mr-1 ${comment.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              <span className="text-xs">{comment.likes || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
              <MessageCircle className="h-4 w-4 mr-1" />
              <span className="text-xs">Reply</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onShare(comment.id)}>
              <Share2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Share</span>
            </Button>
          </div>
          {showReplyForm && (
            <div className="mt-2">
              <VoiceCommentForm onCommentAdded={handleReply} />
            </div>
          )}
        </CardContent>
      </Card>
      {comment.replies && comment.replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          depth={depth + 1}
          onReply={onReply}
          onLike={onLike}
          onShare={onShare}
        />
      ))}
    </div>
  );
};

const EchoComments = ({ echoId, comments, onCommentAdded }) => {
  const [localComments, setLocalComments] = useState(comments);

  const handleLike = async (commentId) => {
    const updateCommentLikes = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: (comment.likes || 0) + 1 };
        }
        if (comment.replies) {
          return { ...comment, replies: updateCommentLikes(comment.replies) };
        }
        return comment;
      });
    };

    const updatedComments = updateCommentLikes(localComments);
    setLocalComments(updatedComments);
    const updatedComment = updatedComments.find(comment => comment.id === commentId);
    if (updatedComment) {
      await updateComment(updatedComment);
    }
  };

  const handleReply = async (parentCommentId, audioBlob) => {
    const newReply = {
      id: Date.now().toString(),
      echoId,
      parentCommentId,
      audioData: URL.createObjectURL(audioBlob),
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    const updateCommentsWithReply = (comments) => {
      return comments.map(comment => {
        if (comment.id === parentCommentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), newReply],
          };
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateCommentsWithReply(comment.replies),
          };
        }
        return comment;
      });
    };

    const updatedComments = updateCommentsWithReply(localComments);
    setLocalComments(updatedComments);
    await addComment(echoId, newReply);
  };

  const handleShare = (commentId) => {
    // Implement share functionality
    console.log('Sharing comment:', commentId);
  };

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      {localComments.map((comment) => (
        <motion.div
          key={comment.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CommentItem
            comment={comment}
            onReply={handleReply}
            onLike={handleLike}
            onShare={handleShare}
          />
        </motion.div>
      ))}
      {localComments.length === 0 && (
        <p className="text-sm text-gray-500">No comments yet. Be the first to comment!</p>
      )}
      <div className="mt-4">
        <h4 className="text-md font-semibold mb-2">Add a comment</h4>
        <VoiceCommentForm onCommentAdded={(audioBlob) => handleReply(null, audioBlob)} />
      </div>
    </div>
  );
};

export default EchoComments;