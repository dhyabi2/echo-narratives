import React from 'react';
import { Button } from './ui/button';
import { useCategories } from '../hooks/useCategories';

const EchoCategories = ({ onSelectCategory }) => {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <div>Loading categories...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant="outline"
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default EchoCategories;