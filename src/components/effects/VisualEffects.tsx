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
  isPoseDetected,
  isProcessing,
  elbowPositions
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <AnimatePresence>
        {isPoseDetected && elbowPositions && (
          <>
            {elbowPositions.leftElbow && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-8 h-8 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${elbowPositions.leftElbow.x * 640}px`,
                  top: `${elbowPositions.leftElbow.y * 480}px`
                }}
              />
            )}
            {elbowPositions.rightElbow && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute w-8 h-8 bg-green-500 rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${elbowPositions.rightElbow.x * 640}px`,
                  top: `${elbowPositions.rightElbow.y * 480}px`
                }}
              />
            )}
          </>
        )}
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