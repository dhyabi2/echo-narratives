import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const SortSelector = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="trending">Trending</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="mostLiked">Most Liked</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortSelector;