import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';

const EchoComments = ({ echoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // Fetch comments for the echo
    // This is a placeholder for actual API calls
    setComments([
      { id: 1, user: { name: 'Alice', avatar: '/placeholder.svg' }, content: 'Great echo!', createdAt: new Date().toISOString() },
      { id: 2, user: { name: 'Bob', avatar: '/placeholder.svg' }, content: 'Interesting perspective.', createdAt: new Date().toISOString() },
    ]);
  }, [echoId]);

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // Add new comment
      const comment = {
        id: comments.length + 1,
        user: { name: 'Current User', avatar: '/placeholder.svg' },
        content: newComment,
        createdAt: new Date().toISOString(),
      };
      setComments([...comments, comment]);
      setNewComment('');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Comments</h3>
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-3">
            <Avatar>
              <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
              <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{comment.user.name}</p>
              <p className="text-sm text-gray-500">{comment.content}</p>
              <p className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={handleSubmitComment}>Post</Button>
      </div>
    </div>
  );
};

export default EchoComments;