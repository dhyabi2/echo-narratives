import React, { useState, useEffect } from 'react';
import { getEchoTranscript } from '../lib/db';

const EchoTranscript = ({ echoId }) => {
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        const fetchedTranscript = await getEchoTranscript(echoId);
        setTranscript(fetchedTranscript);
      } catch (error) {
        console.error('Error fetching transcript:', error);
        setTranscript('Transcript unavailable');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranscript();
  }, [echoId]);

  if (isLoading) {
    return <div>Loading transcript...</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Transcript</h3>
      <p className="text-sm whitespace-pre-wrap">{transcript}</p>
    </div>
  );
};

export default EchoTranscript;