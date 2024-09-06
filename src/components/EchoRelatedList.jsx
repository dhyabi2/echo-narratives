import React, { useState, useEffect } from 'react';
import { getRelatedEchoes } from '../lib/db';
import EchoCard from './EchoCard';

const EchoRelatedList = ({ currentEchoId }) => {
  const [relatedEchoes, setRelatedEchoes] = useState([]);

  useEffect(() => {
    const fetchRelatedEchoes = async () => {
      const fetchedEchoes = await getRelatedEchoes(currentEchoId);
      setRelatedEchoes(fetchedEchoes);
    };
    fetchRelatedEchoes();
  }, [currentEchoId]);

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-2">Related Echoes</h3>
      <div className="space-y-4">
        {relatedEchoes.map((echo) => (
          <EchoCard key={echo.id} echo={echo} />
        ))}
      </div>
    </div>
  );
};

export default EchoRelatedList;