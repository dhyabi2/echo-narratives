import React, { useState, useEffect } from 'react';
import EchoCard from './EchoCard';

const RelatedEchoes = ({ echoId }) => {
  const [relatedEchoes, setRelatedEchoes] = useState([]);

  useEffect(() => {
    // Fetch related echoes
    // This is a placeholder for actual API calls
    setRelatedEchoes([
      { id: 4, title: 'Similar Echo 1', duration: '1:45', likes: 50, category: 'Related' },
      { id: 5, title: 'Similar Echo 2', duration: '2:30', likes: 75, category: 'Related' },
    ]);
  }, [echoId]);

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Related Echoes</h3>
      <div className="space-y-4">
        {relatedEchoes.map((echo) => (
          <EchoCard key={echo.id} echo={echo} />
        ))}
      </div>
    </div>
  );
};

export default RelatedEchoes;