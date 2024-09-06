import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

const EchoTagInput = ({ onTagsChange }) => {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      const newTags = [...tags, inputValue.trim()];
      setTags(newTags);
      setInputValue('');
      onTagsChange(newTags);
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    onTagsChange(newTags);
  };

  return (
    <div>
      <Input
        placeholder="Add tags (press Enter to add)"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-1">
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default EchoTagInput;