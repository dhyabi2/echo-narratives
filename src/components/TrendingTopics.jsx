import React from 'react';
import { TrendingUp } from 'lucide-react';

const TrendingTopics = ({ topics }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="font-semibold mb-2 flex items-center">
        <TrendingUp className="h-5 w-5 mr-2" />
        Trending Topics
      </h3>
      <ul className="space-y-2">
        {topics.map((topic) => (
          <li key={topic.id} className="text-sm">
            <a href={`#${topic.slug}`} className="text-blue-500 hover:underline">
              #{topic.name}
            </a>
            <span className="text-gray-500 ml-2">{topic.echoCount} echoes</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrendingTopics;