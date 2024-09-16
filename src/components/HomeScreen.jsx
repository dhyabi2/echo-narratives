import React, { useState, useEffect, useRef, useCallback } from 'react';
import EchoCard from './EchoCard';
import { getEchoesByCountry, addEcho } from '../lib/db';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCountry } from '../contexts/CountryContext';

const ECHOES_PER_PAGE = 10;

const HomeScreen = () => {
  const { t } = useTranslation();
  const [echoes, setEchoes] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const { country } = useCountry();

  const lastEchoElementRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await getEchoesByCountry(country, page, ECHOES_PER_PAGE);
        setEchoes(prevEchoes => [...prevEchoes, ...response.echoes]);
      } catch (error) {
        console.error('Error fetching echoes:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [page, country]);

  const handleEchoUpdated = (updatedEcho) => {
    setEchoes(prevEchoes => prevEchoes.map(echo => echo.id === updatedEcho.id ? updatedEcho : echo));
  };

  const handleNewEcho = async (newEcho) => {
    try {
      const addedEcho = await addEcho({ ...newEcho, country });
      setEchoes(prevEchoes => [addedEcho, ...prevEchoes]);
    } catch (error) {
      console.error('Error adding new echo:', error);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {!isOnline && (
        <div className="bg-yellow-100 border-r-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>{t('You are currently offline. Changes will be synced when you reconnect.')}</p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">{t('Echo of Voices')}</h1>

      <AnimatePresence>
        {echoes.map((echo, index) => (
          <motion.div
            key={echo.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            ref={index === echoes.length - 1 ? lastEchoElementRef : null}
          >
            <EchoCard echo={echo} onEchoUpdated={handleEchoUpdated} />
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoading && <LoadingSpinner />}
      {!isLoading && echoes.length === 0 && <p>{t('No echoes found')}</p>}
    </div>
  );
};

export default HomeScreen;
