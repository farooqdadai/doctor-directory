'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavigationLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Reset loading state when navigation completes
    setIsLoading(false);
    setProgress(0);
  }, [pathname, searchParams]);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');

      if (anchor) {
        const href = anchor.getAttribute('href');
        // Check if it's an internal navigation link
        if (href && href.startsWith('/') && !href.startsWith('//')) {
          const currentUrl = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
          // Only show loader if navigating to a different page
          if (href !== currentUrl && !href.startsWith('#')) {
            setIsLoading(true);
            setProgress(0);

            // Animate progress
            progressInterval = setInterval(() => {
              setProgress(prev => {
                if (prev >= 90) {
                  clearInterval(progressInterval);
                  return 90;
                }
                return prev + Math.random() * 15;
              });
            }, 100);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-[100] h-1 bg-brand-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-brand-700 via-brand-500 to-brand-400"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute right-0 top-0 h-full w-24 bg-gradient-to-r from-transparent to-brand-300/50"
            animate={{
              opacity: [0.5, 1, 0.5],
              x: [0, 10, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
