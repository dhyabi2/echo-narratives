import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';

const EchoTranscription = ({ audioUrl }) => {
  const [transcription, setTranscription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const transcribeAudio = async () => {
    setIsLoading(true);
    try {
      // This is a placeholder. You would typically send the audio to a server for transcription.
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: JSON.stringify({ audioUrl }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setTranscription(data.transcription);
    } catch (error) {
      console.error('Transcription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={transcribeAudio} disabled={isLoading}>
        {isLoading ? 'Transcribing...' : 'Transcribe Echo'}
      </Button>
      {transcription && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
    </div>
  );
};

export default EchoTranscription;