import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

const EchoStats = ({ likes, replies, shares }) => {
  return (
    <div className="flex space-x-4 text-sm text-gray-500">
      <div className="flex items-center">
        <Heart className="h-4 w-4 mr-1" />
        <span>{likes}</span>
      </div>
      <div className="flex items-center">
        <MessageCircle className="h-4 w-4 mr-1" />
        <span>{replies}</span>
      </div>
      <div className="flex items-center">
        <Share2 className="h-4 w-4 mr-1" />
        <span>{shares}</span>
      </div>
    </div>
  );
};

export default EchoStats;