import React, { useState, useEffect } from 'react';
import { getEchoes } from '../lib/db';
import EchoCard from './EchoCard';

const EchoFeed = () => {
  const [echoes, setEchoes] = useState([]);

  useEffect(() => {
    const fetchEchoes = async () => {
      const fetchedEchoes = await getEchoes();
      setEchoes(fetchedEchoes);
    };
    fetchEchoes();
  }, []);

  return (
    <div className="space-y-4">
      {echoes.map((echo) => (
        <EchoCard key={echo.id} echo={echo} />
      ))}
    </div>
  );
};

export default EchoFeed;