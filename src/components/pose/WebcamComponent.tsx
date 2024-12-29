import React from 'react';

interface WebcamComponentProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isFullscreen: boolean;
}

export const WebcamComponent: React.FC<WebcamComponentProps> = ({
  videoRef,
  isFullscreen,
}) => {
  return (
    <video
      ref={videoRef}
      className={`border-2 border-gray-300 ${
        isFullscreen ? 'w-full h-full object-contain' : 'w-[640px] h-[480px]'
      } transform scale-x-[-1]`}
      autoPlay
      playsInline
    />
  );
};