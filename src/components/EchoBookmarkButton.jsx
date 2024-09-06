import React, { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from './ui/button';
import { toggleEchoBookmark, isEchoBookmarked } from '../lib/db';

const EchoBookmarkButton = ({ echoId }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      const bookmarked = await isEchoBookmarked(echoId);
      setIsBookmarked(bookmarked);
    };
    checkBookmarkStatus();
  }, [echoId]);

  const handleToggleBookmark = async () => {
    const newStatus = await toggleEchoBookmark(echoId);
    setIsBookmarked(newStatus);
  };

  return (
    <Button variant="ghost" size="sm" onClick={handleToggleBookmark}>
      <Bookmark className={`h-5 w-5 mr-1 ${isBookmarked ? 'fill-current' : ''}`} />
      {isBookmarked ? 'Bookmarked' : 'Bookmark'}
    </Button>
  );
};

export default EchoBookmarkButton;