import React from 'react';
import { Badge } from '@/components/ui/badge';

interface HeaderProps {
  isWebcamEnabled: boolean;
  fps: number;
}

export const Header: React.FC<HeaderProps> = ({ isWebcamEnabled, fps }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl">
      <div className="flex gap-2 items-center">
        <Badge variant={isWebcamEnabled ? "default" : "secondary"}>
          {isWebcamEnabled ? "Webcam On" : "Webcam Off"}
        </Badge>
        <Badge variant="outline">{fps} FPS</Badge>
      </div>
    </div>
  );
};