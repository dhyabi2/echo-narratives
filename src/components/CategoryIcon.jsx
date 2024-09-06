import React from 'react';
import { Mic, Heart, Lightbulb, Globe, Music, Book } from 'lucide-react';

const iconMap = {
  confession: Mic,
  love: Heart,
  advice: Lightbulb,
  travel: Globe,
  music: Music,
  story: Book,
};

const CategoryIcon = ({ category, className }) => {
  const Icon = iconMap[category.toLowerCase()] || Mic;
  return <Icon className={className} />;
};

export default CategoryIcon;