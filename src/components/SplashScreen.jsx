import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3000);

    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500"
    >
      <motion.img
        src="/placeholder.svg"
        alt="اعترافات Logo"
        className="w-32 h-32 mb-4"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.h1
        className="text-4xl font-bold text-white mb-2"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        اعترافات
      </motion.h1>
      <motion.p
        className="text-xl text-white mb-8"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        اكتشف الأصوات، شارك القصص
      </motion.p>
      <motion.div
        className="w-64 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="h-full bg-white"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;