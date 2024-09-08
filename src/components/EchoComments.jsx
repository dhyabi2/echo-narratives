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
      setComments(fetchedComments);
    };
    fetchComments();
  }, [echoId]);

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id} className="bg-gray-50">
          <CardContent className="pt-4">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">Anonymous User</span>
            </div>
            <AudioPlayer src={comment.audioData} />
            <p className="text-xs text-gray-500 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
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