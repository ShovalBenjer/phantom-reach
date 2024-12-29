import React, { useRef, useState, lazy, Suspense } from 'react';
import { toast } from '@/hooks/use-toast';
import { AmputationType } from '../types';
import { poseDetectionService } from '../services/poseDetection';
import { WEBCAM_CONFIG } from '../config/detection';
import { PoseControls } from './pose/PoseControls';
import { StatusIndicators } from './pose/StatusIndicators';
import { WebcamComponent } from './pose/WebcamComponent';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { DefrostGame } from './game/DefrostGame';

// Lazy load the HandVisualization component
const HandVisualization = lazy(() => import('./pose/HandVisualization').then(module => ({
  default: module.HandVisualization
})));

export const PoseDetectionUI: React.FC = () => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isVirtualHandEnabled, setIsVirtualHandEnabled] = useState(true);
  const [amputationType, setAmputationType] = useState<AmputationType>('left_arm');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGame, setShowGame] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    isDetectionActive,
    isPoseDetected,
    fps,
    leftElbow,
    rightElbow,
    leftShoulder,
    rightShoulder,
    toggleDetection,
  } = usePoseDetection(videoRef);

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
        toggleDetection();
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

  return (
    <div 
      ref={containerRef} 
      className={`flex flex-col items-center space-y-4 p-6 ${isFullscreen ? 'fixed inset-0 bg-background' : ''}`}
      role="main"
      aria-label="Pose Detection Interface"
    >
      <StatusIndicators
        isWebcamEnabled={isWebcamEnabled}
        isPoseDetected={isPoseDetected}
        fps={fps}
      />

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

      {isWebcamEnabled && (
        <div className="w-full max-w-4xl">
          <DefrostGame />
        </div>
      )}

      <div 
        className={`relative ${isFullscreen ? 'flex-1 w-full flex items-center justify-center' : ''}`}
        role="region"
        aria-label="Visualization Area"
      >
        <WebcamComponent
          videoRef={videoRef}
          isFullscreen={isFullscreen}
        />
        <Suspense fallback={<div className="animate-pulse">Loading visualization...</div>}>
          {isWebcamEnabled && (
            <HandVisualization
              isDetectionActive={isDetectionActive}
              isVirtualHandEnabled={isVirtualHandEnabled}
              amputationType={amputationType}
              leftElbow={leftElbow}
              rightElbow={rightElbow}
              leftShoulder={leftShoulder}
              rightShoulder={rightShoulder}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};
