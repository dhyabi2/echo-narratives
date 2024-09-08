import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { ArrowDownUp } from 'lucide-react';
import EchoCard from './EchoCard';
import { getEchoesByCountry, addEcho } from '../lib/db';
import LoadingSpinner from './LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useCountry } from '../contexts/CountryContext';

const ECHOES_PER_PAGE = 10;

const HomeScreen = () => {
  const { t } = useTranslation();
  const sortOptions = ['الأكثر رواجًا', 'الأحدث', 'الأكثر إعجابًا'];
  const [sortBy, setSortBy] = useState('الأكثر رواجًا');
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

    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
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
  };

  const sortedEchoes = [...echoes].sort((a, b) => {
    if (sortBy === 'الأحدث') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === 'الأكثر إعجابًا') {
      return (b.likes || 0) - (a.likes || 0);
    } else {
      // الأكثر رواجًا: مزيج من الإعجابات والردود والحداثة
      const aScore = ((a.likes || 0) + (a.replies || 0)) * (1 / (Date.now() - new Date(a.createdAt).getTime()));
      const bScore = ((b.likes || 0) + (b.replies || 0)) * (1 / (Date.now() - new Date(b.createdAt).getTime()));
      return bScore - aScore;
    }
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {!isOnline && (
        <div className="bg-yellow-100 border-r-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>أنت حاليًا غير متصل بالإنترنت. قد تكون بعض الميزات محدودة.</p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">تغذية الأصداء</h1>
        <Button variant="outline" size="sm" onClick={() => {
          const nextIndex = (sortOptions.indexOf(sortBy) + 1) % sortOptions.length;
          setSortBy(sortOptions[nextIndex]);
        }}>
          <ArrowDownUp className="h-4 w-4 ml-2" />
          {sortBy}
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
      {!isLoading && sortedEchoes.length === 0 && <p>لم يتم العثور على أصداء</p>}
    </div>
  );
};

export default HomeScreen;