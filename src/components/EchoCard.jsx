import React from 'react';
import { Play, Heart, Mic, Share2 } from 'lucide-react';
import { Button } from './ui/button';

const EchoCard = ({ echo }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">{echo.title}</h3>
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon">
          <Play className="h-4 w-4" />
        </Button>
        <span className="text-sm text-gray-500">{echo.duration}</span>
      </div>
      <div className="flex justify-between items-center">
        <Button variant="ghost" size="sm">
          <Heart className="h-4 w-4 mr-1" />
          {echo.likes}
        </Button>
        <Button variant="ghost" size="sm">
          <Mic className="h-4 w-4 mr-1" />
          Reply
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>
    </div>
  );
};

export default EchoCard;