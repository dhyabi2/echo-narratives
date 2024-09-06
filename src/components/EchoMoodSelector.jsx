import React from 'react';
import { Smile, Meh, Frown, Heart, Star } from 'lucide-react';
import { Button } from './ui/button';

const moods = [
  { icon: Smile, label: 'Happy' },
  { icon: Meh, label: 'Neutral' },
  { icon: Frown, label: 'Sad' },
  { icon: Heart, label: 'Love' },
  { icon: Star, label: 'Excited' },
];

const EchoMoodSelector = ({ onMoodSelect }) => {
  return (
    <div className="flex space-x-2">
      {moods.map(({ icon: Icon, label }) => (
        <Button
          key={label}
          variant="outline"
          size="sm"
          onClick={() => onMoodSelect(label)}
          title={label}
        >
          <Icon className="h-5 w-5" />
        </Button>
      ))}
    </div>
  );
};

export default EchoMoodSelector;