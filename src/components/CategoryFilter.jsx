import React from 'react';
import { Button } from './ui/button';
import CategoryIcon from './CategoryIcon';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className="flex items-center"
        >
          <CategoryIcon category={category} className="h-4 w-4 mr-1" />
          <span>{category}</span>
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;