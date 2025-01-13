import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VisualEffectsProps {
  isPoseDetected: boolean;
  isProcessing: boolean;
  elbowPositions?: {
    leftElbow?: { x: number; y: number } | null;
    rightElbow?: { x: number; y: number } | null;
  };
}

export const VisualEffects: React.FC<VisualEffectsProps> = ({
  isProcessing
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/10 flex items-center justify-center"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};