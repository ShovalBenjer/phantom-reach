import { useEffect, useRef, useState } from 'react';
import { poseDetectionService } from '../services/poseDetection';
import { Landmark } from '../types';
import { toast } from '@/hooks/use-toast';

export const usePoseDetection = (videoRef: React.RefObject<HTMLVideoElement>) => {
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [isPoseDetected, setIsPoseDetected] = useState(false);
  const [fps, setFps] = useState(0);
  const [poseBuffer, setPoseBuffer] = useState<boolean[]>([]);
  const [leftElbow, setLeftElbow] = useState<Landmark | null>(null);
  const [rightElbow, setRightElbow] = useState<Landmark | null>(null);
  const [leftShoulder, setLeftShoulder] = useState<Landmark | null>(null);
  const [rightShoulder, setRightShoulder] = useState<Landmark | null>(null);

  const fpsIntervalRef = useRef<number>();
  const animationFrameRef = useRef<number>();
  const detectionLoopRef = useRef<boolean>(false);
  const bufferSize = 10;

  const startPoseDetection = async () => {
    if (!videoRef.current) {
      console.log('[PoseDetection] Video ref not available');
      return;
    }

    console.log('[PoseDetection] Starting detection loop');
    detectionLoopRef.current = true;

    const detectFrame = async () => {
      if (!detectionLoopRef.current) return;
      
      try {
        const elbows = await poseDetectionService.detectElbows(videoRef.current!);
        
        if (elbows) {
          console.log('[PoseDetection] Detected elbows:', elbows);
          const newBuffer = [...poseBuffer, true].slice(-bufferSize);
          setPoseBuffer(newBuffer);
          setIsPoseDetected(newBuffer.filter(Boolean).length > bufferSize * 0.7);
          
          setLeftElbow(elbows.leftElbow);
          setRightElbow(elbows.rightElbow);
          setLeftShoulder(elbows.landmarks?.[11] || null);
          setRightShoulder(elbows.landmarks?.[12] || null);
        } else {
          console.log('[PoseDetection] No elbows detected in this frame');
          const newBuffer = [...poseBuffer, false].slice(-bufferSize);
          setPoseBuffer(newBuffer);
          setIsPoseDetected(newBuffer.filter(Boolean).length > bufferSize * 0.7);
        }

        animationFrameRef.current = requestAnimationFrame(detectFrame);
      } catch (error) {
        console.error('[PoseDetection] Error in detection loop:', error);
        detectionLoopRef.current = false;
        toast({
          title: "Detection Error",
          description: "An error occurred during pose detection. Please try again.",
          variant: "destructive",
        });
      }
    };

    detectFrame();
  };

  const toggleDetection = () => {
    if (isDetectionActive) {
      console.log('Stopping detection...');
      detectionLoopRef.current = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      setLeftElbow(null);
      setRightElbow(null);
      setLeftShoulder(null);
      setRightShoulder(null);
      setPoseBuffer([]);
    } else {
      console.log('Starting detection...');
      startPoseDetection();
    }
    setIsDetectionActive(!isDetectionActive);
  };

  useEffect(() => {
    return () => {
      if (fpsIntervalRef.current) {
        clearInterval(fpsIntervalRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      detectionLoopRef.current = false;
    };
  }, []);

  useEffect(() => {
    fpsIntervalRef.current = window.setInterval(() => {
      setFps(poseDetectionService.getFPS());
    }, 1000);

    return () => {
      if (fpsIntervalRef.current) {
        clearInterval(fpsIntervalRef.current);
      }
    };
  }, []);

  return {
    isDetectionActive,
    isPoseDetected,
    fps,
    leftElbow,
    rightElbow,
    leftShoulder,
    rightShoulder,
    toggleDetection,
  };
};