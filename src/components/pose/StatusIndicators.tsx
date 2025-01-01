import React from 'react';
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
  return (
    <div className="flex gap-2 items-center">
      <Badge variant={isWebcamEnabled ? "default" : "secondary"}>
        {isWebcamEnabled ? "Webcam On" : "Webcam Off"}
      </Badge>
      <Badge variant={isPoseDetected ? "default" : "secondary"}>
        {isPoseDetected ? "Pose Detected" : "No Pose"}
      </Badge>
      <Badge variant="outline">{fps} FPS</Badge>
    </div>
  );
};