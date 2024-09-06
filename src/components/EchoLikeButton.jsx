import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { updateEchoLikes } from '../lib/db';

const EchoLikeButton = ({ echoId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = async () => {
    const newLikes = isLiked ? likes - 1 : likes + 1;
    await updateEchoLikes(echoId, newLikes);
    setLikes(newLikes);
    setIsLiked(!isLiked);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleLike}>
      <Heart className={`h-5 w-5 mr-1 ${isLiked ? 'fill-current text-red-500' : ''}`} />
      {likes}
    </Button>
  );
};

export default EchoLikeButton;