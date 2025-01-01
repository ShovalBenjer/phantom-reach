import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusIndicatorsProps {
  isWebcamEnabled: boolean;
  isPoseDetected: boolean;
  fps: number;
}

export const StatusIndicators: React.FC<StatusIndicatorsProps> = ({
  isWebcamEnabled,
  isPoseDetected,
  fps,
}) => {
  const [isStablePoseDetected, setIsStablePoseDetected] = useState(false);
  
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isPoseDetected) {
      setIsStablePoseDetected(true);
      timeoutId = setTimeout(() => {
        if (!isPoseDetected) {
          setIsStablePoseDetected(false);
        }
      }, 5000); // 5 seconds delay
    } else {
      setIsStablePoseDetected(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isPoseDetected]);

  return (
    <div className="flex gap-2 items-center">
      <Badge variant={isWebcamEnabled ? "default" : "secondary"}>
        {isWebcamEnabled ? "Webcam On" : "Webcam Off"}
      </Badge>
      <Badge variant={isStablePoseDetected ? "default" : "secondary"}>
        {isStablePoseDetected ? "Pose Detected" : "No Pose"}
      </Badge>
      <Badge variant="outline">{fps} FPS</Badge>
    </div>
  );
};