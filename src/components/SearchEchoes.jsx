import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useSearchEchoes } from '../hooks/useSearchEchoes';
import EchoList from './EchoList';

const SearchEchoes = () => {
  const [query, setQuery] = useState('');
  const { search, results, isLoading, error } = useSearchEchoes();

  const handleSearch = (e) => {
    e.preventDefault();
    search(query);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search echoes..."
        />
        <Button type="submit">Search</Button>
      </form>
      {isLoading && <div>Searching...</div>}
      {error && <div>Error: {error.message}</div>}
      {results && <EchoList echoes={results} />}
    </div>
  );
};

export default SearchEchoes;