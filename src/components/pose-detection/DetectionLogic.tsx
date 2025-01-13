import React, { useEffect, useRef } from 'react';
import { poseDetectionService } from '../../services/poseDetection';
import { VirtualHandService } from '../../services/virtualHand';
import { AmputationType } from '../../types';

interface DetectionLogicProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isDetectionActive: boolean;
  isVirtualHandEnabled: boolean;
  amputationType: AmputationType;
  setIsPoseDetected: (detected: boolean) => void;
  setCurrentElbowPositions: (positions: {
    leftElbow?: { x: number; y: number; z: number } | null;
    rightElbow?: { x: number; y: number; z: number } | null;
  }) => void;
  setFps: (fps: number) => void;
}

export const DetectionLogic: React.FC<DetectionLogicProps> = ({
  videoRef,
  canvasRef,
  isDetectionActive,
  isVirtualHandEnabled,
  amputationType,
  setIsPoseDetected,
  setCurrentElbowPositions,
  setFps,
}) => {
  const virtualHandServiceRef = useRef<VirtualHandService | null>(null);
  const fpsIntervalRef = useRef<number>();
  const animationFrameRef = useRef<number>();
  const detectionLoopRef = useRef<boolean>(false);

  useEffect(() => {
    if (canvasRef.current) {
      virtualHandServiceRef.current = new VirtualHandService(canvasRef.current);
    }

    fpsIntervalRef.current = window.setInterval(() => {
      setFps(poseDetectionService.getFPS());
    }, 1000);

    return () => {
      virtualHandServiceRef.current?.dispose();
      if (fpsIntervalRef.current) {
        clearInterval(fpsIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      detectionLoopRef.current = false;
    };
  }, [setFps]);

  useEffect(() => {
    if (isDetectionActive) {
      startPoseDetection();
    } else {
      detectionLoopRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  }, [isDetectionActive, isVirtualHandEnabled, amputationType]);

  const startPoseDetection = async () => {
    if (!videoRef.current || !virtualHandServiceRef.current) {
      console.log('Cannot start detection - missing refs:', {
        hasVideoRef: !!videoRef.current,
        hasVirtualHandRef: !!virtualHandServiceRef.current
      });
      return;
    }

    detectionLoopRef.current = true;

    const detectFrame = async () => {
      if (!detectionLoopRef.current) {
        console.log('Detection stopped');
        return;
      }
      
      try {
        const elbows = await poseDetectionService.detectElbows(videoRef.current!);
        setIsPoseDetected(!!elbows);
        
        if (elbows) {
          console.log('Elbows detected:', elbows);
          setCurrentElbowPositions({
            leftElbow: elbows.leftElbow ? { ...elbows.leftElbow, z: elbows.leftElbow.z || 0 } : null,
            rightElbow: elbows.rightElbow ? { ...elbows.rightElbow, z: elbows.rightElbow.z || 0 } : null
          });
          
          virtualHandServiceRef.current?.clearCanvas();
          
          if (amputationType === 'left_arm' || amputationType === 'both') {
            virtualHandServiceRef.current?.renderHand(elbows.leftElbow, { 
              color: 'rgba(255, 0, 0, 0.6)',
              showVirtualHand: isVirtualHandEnabled 
            });
          }
          if (amputationType === 'right_arm' || amputationType === 'both') {
            virtualHandServiceRef.current?.renderHand(elbows.rightElbow, { 
              color: 'rgba(0, 255, 0, 0.6)',
              showVirtualHand: isVirtualHandEnabled 
            });
          }
        }

        animationFrameRef.current = requestAnimationFrame(detectFrame);
      } catch (error) {
        console.error('Error in pose detection:', error);
        detectionLoopRef.current = false;
      }
    };

    detectFrame();
  };

  return null;
};