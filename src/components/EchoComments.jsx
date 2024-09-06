import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const EchoComments = ({ comments }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Comments</h3>
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
  );
};

export default EchoComments;