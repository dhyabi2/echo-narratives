import React from 'react';
import { ThumbsUp, ThumbsDown, Heart, Laugh } from 'lucide-react';
import { Button } from './ui/button';

const EchoReactions = ({ echo }) => {
  const handleReaction = (type) => {
    // Implement reaction logic
    console.log(`Reacting with ${type} to echo:`, echo.id);
  };

  return (
    <div className="flex space-x-2">
      <Button variant="ghost" size="sm" onClick={() => handleReaction('like')}>
        <ThumbsUp className="h-4 w-4 mr-1" />
        {echo.likes || 0}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleReaction('dislike')}>
        <ThumbsDown className="h-4 w-4 mr-1" />
        {echo.dislikes || 0}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleReaction('love')}>
        <Heart className="h-4 w-4 mr-1" />
        {echo.loves || 0}
      </Button>
      <Button variant="ghost" size="sm" onClick={() => handleReaction('laugh')}>
        <Laugh className="h-4 w-4 mr-1" />
        {echo.laughs || 0}
      </Button>
    </div>
  );
};

export default EchoReactions;