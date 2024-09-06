import React from 'react';
import { Hash } from 'lucide-react';
import { Badge } from './ui/badge';

const EchoTags = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="flex items-center">
          <Hash className="h-3 w-3 mr-1" />
          {tag}
        </Badge>
      ))}
    </div>
  );
};

export default EchoTags;