import React, { useState, useEffect } from 'react';
import { getComments } from '../lib/db';
import AudioPlayer from './AudioPlayer';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const EchoComments = ({ echoId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments(echoId);
      // Sort comments by likes in descending order
      const sortedComments = fetchedComments.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      setComments(sortedComments);
    };
    fetchComments();
  }, [echoId]);

  return (
    <div className="space-y-4 mt-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="bg-gray-50">
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
              <span className="text-xs text-gray-500">{comment.likes || 0} likes</span>
            </div>
          </CardContent>
        </Card>
      ))}
      {comments.length === 0 && (
        <p className="text-sm text-gray-500">No comments yet.</p>
      )}
    </div>
  );
};

export default EchoComments;