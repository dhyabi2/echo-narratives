import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getTrendingTopics, addTopic } from '../lib/db';
import { toast } from 'sonner';

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
      const trendExists = trends.some(trend => trend.name.toLowerCase() === newTrend.trim().toLowerCase());
      if (trendExists) {
        toast.error('This trend already exists. Please choose a different name.');
        return;
      }

      const newTrendObject = { name: newTrend.trim() };
      await addTopic(newTrendObject);
      setTrends([...trends, newTrendObject]);
      setSelectedTrend(newTrend.trim());
      onTrendChange(newTrend.trim());
      setNewTrend('');
      setIsAddingNew(false);
      toast.success('New trend added successfully!');
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