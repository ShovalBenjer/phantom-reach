import React, { forwardRef } from 'react';

interface VideoFeedProps {
  className?: string;
}

export const VideoFeed = forwardRef<HTMLVideoElement, VideoFeedProps>(
  ({ className = '' }, ref) => {
    return (
      <video
        ref={ref}
        className={`transform scale-x-[-1] ${className}`}
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    );
  }
);

VideoFeed.displayName = 'VideoFeed';