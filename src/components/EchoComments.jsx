import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useEchoComments } from '../hooks/useEchoComments';

const EchoComments = ({ echoId }) => {
  const [newComment, setNewComment] = useState('');
  const { comments, addComment, isLoading, error } = useEchoComments(echoId);

  const handleSubmit = (e) => {
    e.preventDefault();
    addComment(newComment);
    setNewComment('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} className="bg-gray-100 p-2 rounded">
          <p className="font-semibold">{comment.user.username}</p>
          <p>{comment.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button type="submit" disabled={isLoading}>
          Post
        </Button>
      </form>
      {error && <p className="text-red-500">{error.message}</p>}
    </div>
  );
};

export default EchoComments;