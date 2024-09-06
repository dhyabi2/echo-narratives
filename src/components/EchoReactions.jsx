import React from 'react';
import { Button } from './ui/button';
import { Heart, ThumbsUp, Laugh, Angry } from 'lucide-react';
import { useEchoReactions } from '../hooks/useEchoReactions';

const EchoReactions = ({ echoId }) => {
  const { reactions, addReaction, isLoading } = useEchoReactions(echoId);

  const reactionTypes = [
    { type: 'like', icon: ThumbsUp },
    { type: 'love', icon: Heart },
    { type: 'laugh', icon: Laugh },
    { type: 'angry', icon: Angry },
  ];

  return (
    <div className="flex space-x-2">
      {reactionTypes.map(({ type, icon: Icon }) => (
        <Button
          key={type}
          variant="outline"
          size="sm"
          onClick={() => addReaction(type)}
          disabled={isLoading}
        >
          <Icon className="mr-2 h-4 w-4" />
          {reactions[type] || 0}
        </Button>
      ))}
    </div>
  );
};

export default EchoReactions;