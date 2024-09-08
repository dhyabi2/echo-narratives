import React, { useState, useEffect } from 'react';
import { getComments, addComment } from '../lib/db';
import { Button } from './ui/button';
import { Input } from './ui/input';

const EchoComments = ({ echoId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(echoId);
      setComments(fetchedComments);
    };
    fetchComments();
  }, [echoId]);

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const addedComment = await addComment(echoId, newComment);
      setComments([...comments, addedComment]);
      setNewComment('');
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Comments</h3>
      <div className="space-y-2 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-100 p-2 rounded">
            <p className="text-sm">{comment.content}</p>
            <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <Button onClick={handleAddComment}>Post</Button>
      </div>
    </div>
  );
};

export default EchoComments;