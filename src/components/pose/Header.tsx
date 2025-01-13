import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  isWebcamEnabled: boolean;
  fps: number;
}

export const Header: React.FC<HeaderProps> = ({ isWebcamEnabled, fps }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl">
      <img 
        src="/lovable-uploads/019da9ba-4e1c-41c1-a77c-8dcea51f53b9.png" 
        alt="Phantom Reach" 
        className="h-12 object-contain"
      />
      <div className="flex gap-2 items-center">
        <Badge variant={isWebcamEnabled ? "default" : "secondary"}>
          {isWebcamEnabled ? "Webcam On" : "Webcam Off"}
        </Badge>
        <Badge variant="outline">{fps} FPS</Badge>
      </div>
    </div>
  );
};