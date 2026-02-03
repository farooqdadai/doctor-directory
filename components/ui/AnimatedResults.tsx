'use client';

import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedResultsProps {
  children: ReactNode;
  searchKey: string; // Unique key that changes when filters/search changes
  className?: string;
}

const resultsVariants: Variants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function AnimatedResults({ children, searchKey, className = '' }: AnimatedResultsProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={searchKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={resultsVariants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
