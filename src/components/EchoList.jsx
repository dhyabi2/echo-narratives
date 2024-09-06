import React from 'react';
import EchoCard from './EchoCard';

const EchoList = ({ echoes, onEchoClick }) => {
  return (
    <div className="space-y-4">
      {echoes.map((echo) => (
        <EchoCard key={echo.id} echo={echo} onClick={() => onEchoClick(echo)} />
      ))}
    </div>
  );
};

export default EchoList;