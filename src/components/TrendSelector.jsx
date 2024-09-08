import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getTrendingTopics, addTopic } from '../lib/db';

const TrendSelector = ({ onTrendChange }) => {
  const [trends, setTrends] = useState([]);
  const [selectedTrend, setSelectedTrend] = useState('');
  const [newTrend, setNewTrend] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    const fetchTrends = async () => {
      const fetchedTrends = await getTrendingTopics();
      setTrends(fetchedTrends);
    };
    fetchTrends();
  }, []);

  const handleSelectChange = (value) => {
    if (value === 'add_new') {
      setIsAddingNew(true);
    } else {
      setSelectedTrend(value);
      onTrendChange(value);
    }
  };

  const handleAddNewTrend = async () => {
    if (newTrend.trim()) {
      await addTopic({ name: newTrend.trim() });
      setTrends([...trends, { id: Date.now(), name: newTrend.trim() }]);
      setSelectedTrend(newTrend.trim());
      onTrendChange(newTrend.trim());
      setNewTrend('');
      setIsAddingNew(false);
    }
  };

  return (
    <div>
      {isAddingNew ? (
        <div className="flex space-x-2">
          <Input
            value={newTrend}
            onChange={(e) => setNewTrend(e.target.value)}
            placeholder="Enter new trend"
          />
          <Button onClick={handleAddNewTrend}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      ) : (
        <Select value={selectedTrend} onValueChange={handleSelectChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a trend" />
          </SelectTrigger>
          <SelectContent>
            {trends.map((trend) => (
              <SelectItem key={trend.id} value={trend.name}>{trend.name}</SelectItem>
            ))}
            <SelectItem value="add_new">+ Add new trend</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
};

export default TrendSelector;