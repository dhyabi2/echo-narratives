import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { searchEchoes } from '../lib/db';
import EchoList from './EchoList';

const SearchEchoes = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const searchResults = await searchEchoes(query, { category });
    setResults(searchResults);
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Search echoes..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Categories</SelectItem>
          {/* Add more categories here */}
        </SelectContent>
      </Select>
      <Button onClick={handleSearch}>Search</Button>
      <EchoList echoes={results} />
    </div>
  );
};

export default SearchEchoes;