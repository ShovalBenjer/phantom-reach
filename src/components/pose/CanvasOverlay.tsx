import React, { forwardRef } from 'react';

interface CanvasOverlayProps {
  width: number;
  height: number;
  className?: string;
}

export const CanvasOverlay = forwardRef<HTMLCanvasElement, CanvasOverlayProps>(
  ({ width, height, className = '' }, ref) => {
    return (
      <canvas
        ref={ref}
        className={`absolute top-0 left-0 w-full h-full pointer-events-none transform scale-x-[-1] ${className}`}
        width={width}
        height={height}
        style={{
          width: '100%',
          height: '100%'
        }}
      />
    );
  }
);

CanvasOverlay.displayName = 'CanvasOverlay';