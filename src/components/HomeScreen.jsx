import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { ArrowDownUp } from 'lucide-react';
import EchoCard from './EchoCard';
import { getEchoes, addEcho } from '../lib/db';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from '../hooks/useTranslation';

const sortOptions = ['Trending', 'Newest', 'Most Liked'];
const ECHOES_PER_PAGE = 10;

const HomeScreen = () => {
  const [sortBy, setSortBy] = useState('Trending');
  const [echoes, setEchoes] = useState([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const observer = useRef();
  const { t } = useTranslation();

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
      const fetchedEchoes = await getEchoes();
      setEchoes(prevEchoes => [...prevEchoes, ...fetchedEchoes.slice((page - 1) * ECHOES_PER_PAGE, page * ECHOES_PER_PAGE)]);
      setIsLoading(false);
    };
    fetchData();

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [page]);

  const handleEchoUpdated = (updatedEcho) => {
    setEchoes(prevEchoes => prevEchoes.map(echo => echo.id === updatedEcho.id ? updatedEcho : echo));
  };

  const handleNewEcho = async (newEcho) => {
    const addedEcho = await addEcho(newEcho);
    setEchoes(prevEchoes => [addedEcho, ...prevEchoes]);
  };

  const sortedEchoes = [...echoes].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'Most Liked') {
      return (b.likes || 0) - (a.likes || 0);
    } else {
      // Trending: combination of likes, replies, and recency
      const aScore = (a.likes || 0) + (a.replies || 0) + (Date.now() - new Date(a.createdAt)) / 3600000;
      const bScore = (b.likes || 0) + (b.replies || 0) + (Date.now() - new Date(b.createdAt)) / 3600000;
      return bScore - aScore;
    }
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {!isOnline && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>{t('offline')}</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{t('echoFeed')}</h1>
        <Button variant="outline" size="sm" onClick={() => {
          const nextIndex = (sortOptions.indexOf(sortBy) + 1) % sortOptions.length;
          setSortBy(sortOptions[nextIndex]);
        }}>
          <ArrowDownUp className="h-4 w-4 mr-2" />
          {t(sortBy.toLowerCase())}
        </Button>
      </div>

      <AnimatePresence>
        {sortedEchoes.map((echo, index) => (
          <motion.div
            key={echo.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            ref={index === sortedEchoes.length - 1 ? lastEchoElementRef : null}
          >
            <EchoCard echo={echo} onEchoUpdated={handleEchoUpdated} />
          </motion.div>
        ))}
      </AnimatePresence>

      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default HomeScreen;