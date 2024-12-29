import React, { useEffect, useRef } from 'react';
import { ThreeDHandService } from '../../services/3dHandService';
import { Landmark } from '../../types';

interface ThreeDHandProps {
  isEnabled: boolean;
  isDetectionActive: boolean;
  elbow: Landmark | null;
  shoulder: Landmark | null;
}

export const ThreeDHand: React.FC<ThreeDHandProps> = ({
  isEnabled,
  isDetectionActive,
  elbow,
  shoulder
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<ThreeDHandService | null>(null);

  useEffect(() => {
    if (containerRef.current && !serviceRef.current) {
      serviceRef.current = new ThreeDHandService(containerRef.current);
      serviceRef.current.initialize();
    }

    return () => {
      serviceRef.current?.dispose();
      serviceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      serviceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (serviceRef.current) {
      serviceRef.current.setVisible(isEnabled && isDetectionActive);
      
      if (isEnabled && isDetectionActive && elbow) {
        serviceRef.current.updateHandPosition(elbow, shoulder);
      }
    }
  }, [isEnabled, isDetectionActive, elbow, shoulder]);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};