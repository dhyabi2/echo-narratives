import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

const TrendingTopics = ({ topics, selectedTopic, onTopicSelect }) => {
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
            <Badge
              key={topic.id}
              variant={selectedTopic === topic.name ? "default" : "secondary"}
              className="text-sm cursor-pointer"
              onClick={() => onTopicSelect(topic.name)}
            >
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