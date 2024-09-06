import React from 'react';
import { MapPin } from 'lucide-react';

const EchoMap = ({ latitude, longitude }) => {
  // This is a placeholder for a map component
  // You would typically use a library like react-leaflet or google-maps-react here
  return (
    <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
      <MapPin className="h-8 w-8 text-gray-400" />
      <p className="ml-2 text-gray-600">Map: {latitude}, {longitude}</p>
    </div>
  );
};

export default EchoMap;