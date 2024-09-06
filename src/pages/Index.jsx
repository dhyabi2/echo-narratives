import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SplashScreen from '../components/SplashScreen';
import AuthForm from '../components/AuthForm';
import HomeScreen from '../components/HomeScreen';
import EchoRecorder from '../components/EchoRecorder';
import TrendingEchoes from '../components/TrendingEchoes';
import SearchEchoes from '../components/SearchEchoes';
import UserProfile from '../components/UserProfile';
import DarkModeToggle from '../components/DarkModeToggle';

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <AuthForm />;
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
          <UserProfile />
        </div>
      </main>
    </div>
  );
};

export default Index;