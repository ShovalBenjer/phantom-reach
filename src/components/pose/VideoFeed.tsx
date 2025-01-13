import React, { forwardRef } from 'react';

interface VideoFeedProps {
  className?: string;
}

export const VideoFeed = forwardRef<HTMLVideoElement, VideoFeedProps>(
  ({ className = '' }, ref) => {
    return (
      <video
        ref={ref}
        className={`border-2 border-gray-300 transform scale-x-[-1] ${className}`}
        autoPlay
        playsInline
      />
    );
  }
);

VideoFeed.displayName = 'VideoFeed';