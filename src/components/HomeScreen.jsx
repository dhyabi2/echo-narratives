import React, { useState, useEffect, useRef, useCallback } from 'react';
import EchoCard from './EchoCard';
import { getEchoesByCountry, addEcho, triggerBackgroundSync } from '../lib/db';
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
      const fetchedEchoes = await getEchoesByCountry(country);
      setEchoes(prevEchoes => [...prevEchoes, ...fetchedEchoes.slice((page - 1) * ECHOES_PER_PAGE, page * ECHOES_PER_PAGE)]);
      setIsLoading(false);
    };
    fetchData();

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (navigator.onLine) {
        triggerBackgroundSync();
      }
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
    const addedEcho = await addEcho({ ...newEcho, country });
    setEchoes(prevEchoes => [addedEcho, ...prevEchoes]);
    triggerBackgroundSync();
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {!isOnline && (
        <div className="bg-yellow-100 border-r-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>أنت حاليًا غير متصل بالإنترنت. سيتم مزامنة التغييرات عند استعادة الاتصال.</p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6">صدى الأصوات</h1>

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
      {!isLoading && echoes.length === 0 && <p>لم يتم العثور على اعترافات</p>}
    </div>
  );
};

export default HomeScreen;
