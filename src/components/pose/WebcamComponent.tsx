import React from 'react';
import { Loader2 } from 'lucide-react';

interface WebcamComponentProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isFullscreen: boolean;
}

export const WebcamComponent: React.FC<WebcamComponentProps> = ({
  videoRef,
  isFullscreen,
}) => {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="relative">
      <video
        ref={videoRef}
        className={`border-2 border-gray-300 rounded-lg shadow-lg ${
          isFullscreen ? 'w-full h-full object-contain' : 'w-[640px] h-[480px]'
        } transform scale-x-[-1] transition-all duration-300 ease-in-out`}
        autoPlay
        playsInline
        onLoadedData={() => setIsLoading(false)}
        aria-label="Webcam feed"
        role="img"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
    </div>
  );
};