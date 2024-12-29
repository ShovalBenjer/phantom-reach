import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { AmputationType } from '../types';
import { poseDetectionService } from '../services/poseDetection';
import { WEBCAM_CONFIG } from '../config/detection';
import { PoseControls } from './pose/PoseControls';
import { ThreeDHand } from './pose/ThreeDHand';

export const PoseDetectionUI: React.FC = () => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [isVirtualHandEnabled, setIsVirtualHandEnabled] = useState(true);
  const [isPoseDetected, setIsPoseDetected] = useState(false);
  const [fps, setFps] = useState(0);
  const [amputationType, setAmputationType] = useState<AmputationType>('left_arm');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [poseBuffer, setPoseBuffer] = useState<boolean[]>([]);
  const [leftElbow, setLeftElbow] = useState(null);
  const [rightElbow, setRightElbow] = useState(null);
  const [leftShoulder, setLeftShoulder] = useState(null);
  const [rightShoulder, setRightShoulder] = useState(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fpsIntervalRef = useRef<number>();
  const animationFrameRef = useRef<number>();
  const detectionLoopRef = useRef<boolean>(false);
  const bufferSize = 10; // Increased buffer size for smoother detection

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

  const startWebcam = async () => {
    try {
      console.log('Requesting webcam access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: WEBCAM_CONFIG,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => resolve();
          }
        });
        
        console.log('Webcam stream loaded, initializing pose detection...');
        await poseDetectionService.initialize();
        setIsWebcamEnabled(true);
        setIsDetectionActive(true);
        startPoseDetection();
        
        fpsIntervalRef.current = window.setInterval(() => {
          setFps(poseDetectionService.getFPS());
        }, 1000);
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      toast({
        title: "Webcam Error",
        description: "Failed to access webcam. Please check your permissions and try again.",
        variant: "destructive",
      });
    }
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

  const toggleVirtualHand = () => {
    setIsVirtualHandEnabled(!isVirtualHandEnabled);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const startPoseDetection = async () => {
    if (!videoRef.current) return;

    detectionLoopRef.current = true;

    const detectFrame = async () => {
      if (!detectionLoopRef.current) return;
      
      try {
        const elbows = await poseDetectionService.detectElbows(videoRef.current!);
        
        if (elbows) {
          const newBuffer = [...poseBuffer, true].slice(-bufferSize);
          setPoseBuffer(newBuffer);
          setIsPoseDetected(newBuffer.filter(Boolean).length > bufferSize * 0.7);
          
          setLeftElbow(elbows.leftElbow);
          setRightElbow(elbows.rightElbow);
          setLeftShoulder(elbows.landmarks?.[11] || null);
          setRightShoulder(elbows.landmarks?.[12] || null);
        } else {
          const newBuffer = [...poseBuffer, false].slice(-bufferSize);
          setPoseBuffer(newBuffer);
          setIsPoseDetected(newBuffer.filter(Boolean).length > bufferSize * 0.7);
        }

        animationFrameRef.current = requestAnimationFrame(detectFrame);
      } catch (error) {
        console.error('Error in pose detection:', error);
        detectionLoopRef.current = false;
      }
    };

    detectFrame();
  };

  return (
    <div ref={containerRef} className={`flex flex-col items-center space-y-4 p-6 ${isFullscreen ? 'fixed inset-0 bg-background' : ''}`}>
      <div className="flex gap-2 items-center">
        <Badge variant={isWebcamEnabled ? "default" : "secondary"}>
          {isWebcamEnabled ? "Webcam On" : "Webcam Off"}
        </Badge>
        <Badge variant={isPoseDetected ? "default" : "secondary"}>
          {isPoseDetected ? "Pose Detected" : "No Pose"}
        </Badge>
        <Badge variant="outline">{fps} FPS</Badge>
      </div>

      <PoseControls 
        isWebcamEnabled={isWebcamEnabled}
        isDetectionActive={isDetectionActive}
        isVirtualHandEnabled={isVirtualHandEnabled}
        isFullscreen={isFullscreen}
        amputationType={amputationType}
        onStartWebcam={startWebcam}
        onToggleDetection={toggleDetection}
        onToggleVirtualHand={toggleVirtualHand}
        onToggleFullscreen={toggleFullscreen}
        onAmputationTypeChange={setAmputationType}
      />

      <div className={`relative ${isFullscreen ? 'flex-1 w-full flex items-center justify-center' : ''}`}>
        <video
          ref={videoRef}
          className={`border-2 border-gray-300 ${isFullscreen ? 'w-full h-full object-contain' : 'w-[640px] h-[480px]'} transform scale-x-[-1]`}
          autoPlay
          playsInline
        />
        {isDetectionActive && (
          <>
            {amputationType === 'left_arm' && (
              <ThreeDHand
                isEnabled={isVirtualHandEnabled}
                isDetectionActive={isDetectionActive}
                elbow={leftElbow}
                shoulder={leftShoulder}
              />
            )}
            {amputationType === 'right_arm' && (
              <ThreeDHand
                isEnabled={isVirtualHandEnabled}
                isDetectionActive={isDetectionActive}
                elbow={rightElbow}
                shoulder={rightShoulder}
              />
            )}
            {amputationType === 'both' && (
              <>
                <ThreeDHand
                  isEnabled={isVirtualHandEnabled}
                  isDetectionActive={isDetectionActive}
                  elbow={leftElbow}
                  shoulder={leftShoulder}
                />
                <ThreeDHand
                  isEnabled={isVirtualHandEnabled}
                  isDetectionActive={isDetectionActive}
                  elbow={rightElbow}
                  shoulder={rightShoulder}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};
