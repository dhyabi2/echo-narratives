import { useState } from 'react';
import { searchEchoes } from '../lib/db';

export const useSearchEchoes = () => {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = async (query) => {
    try {
      setIsLoading(true);
      const searchResults = await searchEchoes(query);
      setResults(searchResults);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { search, results, isLoading, error };
};