import React, { useState, useEffect } from 'react';
import SplashScreen from '../components/SplashScreen.jsx';
import HomeScreen from '../components/HomeScreen.jsx';
import EchoRecorder from '../components/EchoRecorder.jsx';
import TrendingEchoes from '../components/TrendingEchoes.jsx';
import SearchEchoes from '../components/SearchEchoes.jsx';
import DarkModeToggle from '../components/DarkModeToggle.jsx';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Echoes</h1>
          <DarkModeToggle />
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <HomeScreen />
          <EchoRecorder />
          <TrendingEchoes />
          <SearchEchoes />
        </div>
      </main>
    </div>
  );
};

export default Index;