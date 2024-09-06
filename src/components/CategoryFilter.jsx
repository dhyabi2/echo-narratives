import React from 'react';
import { Button } from './ui/button';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <ScrollArea className="w-full whitespace-nowrap mb-6">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="flex-shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default CategoryFilter;