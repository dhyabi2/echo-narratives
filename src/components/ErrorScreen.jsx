import React from 'react';
import { AlertTriangle, WifiOff, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

const ErrorScreen = ({ type, onRetry }) => {
  const isOffline = type === 'offline';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {isOffline ? (
        <WifiOff className="h-16 w-16 text-gray-400 mb-4" />
      ) : (
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4" />
      )}
      <h2 className="text-2xl font-bold mb-2">
        {isOffline ? "You're offline" : "Oops! Something went wrong"}
      </h2>
      <p className="text-center text-gray-600 mb-6">
        {isOffline
          ? "Please check your internet connection and try again."
          : "We're having trouble loading this page. Please try again."}
      </p>
      <Button onClick={onRetry} className="flex items-center">
        <RefreshCw className="h-5 w-5 mr-2" />
        Try Again
      </Button>
    </div>
  );
};

export default ErrorScreen;