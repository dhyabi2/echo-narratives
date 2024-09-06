import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';

const EchoLocation = ({ latitude, longitude }) => {
  const [address, setAddress] = useState('');

  useEffect(() => {
    const getAddress = async () => {
      try {
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setAddress(data.results[0].formatted);
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    };

    if (latitude && longitude) {
      getAddress();
    }
  }, [latitude, longitude]);

  return (
    <div className="flex items-center text-sm text-gray-500">
      <MapPin className="h-4 w-4 mr-1" />
      {address || 'Location not available'}
    </div>
  );
};

export default EchoLocation;