import React, { useState, useEffect } from 'react';
import { getTags } from '../lib/db';
import { Badge } from './ui/badge';

const PopularTags = () => {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const fetchTags = async () => {
      const fetchedTags = await getTags();
      setTags(fetchedTags.slice(0, 10)); // Get top 10 tags
    };
    fetchTags();
  }, []);

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Badge key={tag.id} variant="secondary">
          #{tag.name}
        </Badge>
      ))}
    </div>
  );
};

export default PopularTags;