import React from 'react';
import { Clock, Tag, MapPin } from 'lucide-react';

const EchoMetadata = ({ duration, category, createdAt, location }) => {
  return (
    <div className="flex flex-wrap space-x-4 text-sm text-gray-500 mb-2">
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-1" />
        <span>{duration}</span>
      </div>
      <div className="flex items-center">
        <Tag className="h-4 w-4 mr-1" />
        <span>{category}</span>
      </div>
      <div>{new Date(createdAt).toLocaleDateString()}</div>
      {location && (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{location}</span>
        </div>
      )}
    </div>
  );
};

export default EchoMetadata;