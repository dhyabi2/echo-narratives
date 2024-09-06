import React, { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const TrendingTopics = () => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    // Fetch trending topics
    setTopics([
      { id: 1, name: 'SummerAdventures', echoCount: 120 },
      { id: 2, name: 'LifeHacks', echoCount: 95 },
      { id: 3, name: 'TechTalk', echoCount: 80 },
      { id: 4, name: 'MindfulnessMatters', echoCount: 75 },
      { id: 5, name: 'FoodieFridays', echoCount: 70 },
    ]);
  }, []);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Badge key={topic.id} variant="secondary" className="text-sm">
              #{topic.name}
              <span className="ml-1 text-xs text-gray-500">({topic.echoCount})</span>
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrendingTopics;