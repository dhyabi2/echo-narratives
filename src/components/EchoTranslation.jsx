import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';

const EchoTranslation = ({ echoId, originalText }) => {
  const [targetLanguage, setTargetLanguage] = useState('');
  const [translation, setTranslation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const translateEcho = async () => {
    setIsLoading(true);
    try {
      // This is a placeholder. You would typically send the text to a translation API.
      const response = await fetch('/api/translate', {
        method: 'POST',
        body: JSON.stringify({ echoId, text: originalText, targetLanguage }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setTranslation(data.translation);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Select value={targetLanguage} onValueChange={setTargetLanguage}>
        <SelectTrigger>
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="es">Spanish</SelectItem>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="de">German</SelectItem>
          {/* Add more language options */}
        </SelectContent>
      </Select>
      <Button onClick={translateEcho} disabled={!targetLanguage || isLoading}>
        {isLoading ? 'Translating...' : 'Translate'}
      </Button>
      {translation && (
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Translation:</h3>
          <p>{translation}</p>
        </div>
      )}
    </div>
  );
};

export default EchoTranslation;