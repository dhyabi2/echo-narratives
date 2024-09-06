import React from 'react';
import { Clock, Tag } from 'lucide-react';

const EchoMetadata = ({ duration, category, createdAt }) => {
  return (
    <div className="flex space-x-4 text-sm text-gray-500">
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        <span>{duration}</span>
      </div>
      <div className="flex items-center">
        <Tag className="h-4 w-4 mr-1" />
        <span>{category}</span>
      </div>
      <div>{new Date(createdAt).toLocaleDateString()}</div>
    </div>
  );
};

export default EchoMetadata;