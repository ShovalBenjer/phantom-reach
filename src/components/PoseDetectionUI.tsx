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
import { GameIntroduction } from './tutorial/GameIntroduction';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';

const HandVisualization = lazy(() => import('./pose/HandVisualization').then(module => ({
  default: module.HandVisualization
})));

export const PoseDetectionUI: React.FC = () => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isVirtualHandEnabled, setIsVirtualHandEnabled] = useState(true);
  const [amputationType, setAmputationType] = useState<AmputationType>('left_arm');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [showElbowDetection, setShowElbowDetection] = useState(false);
  
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
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm p-4 shadow-md">
        <div className="max-w-md mx-auto">
          <img 
            src="/lovable-uploads/cb4a0533-02e3-47ff-a388-75ca4008048a.png"
            alt="PhantomReach Logo" 
            className="h-16 w-auto mx-auto"
            aria-label="PhantomReach - Virtual Gaming, Real Rehabilitation"
            onError={(e) => {
              console.error('Image failed to load:', e);
              e.currentTarget.src = 'placeholder.svg';
            }}
          />
        </div>
      </div>

      <div className="mt-24">
        <GameIntroduction />
      </div>
      
      <StatusIndicators
        isWebcamEnabled={isWebcamEnabled}
        isPoseDetected={isPoseDetected}
        fps={fps}
      />

      <div className="flex gap-2 mb-4">
        <Button
          variant="outline"
          onClick={() => setShowElbowDetection(!showElbowDetection)}
          className="flex items-center gap-2"
        >
          {showElbowDetection ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showElbowDetection ? "Hide" : "Show"} Amputated Arm Detection
        </Button>
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
        
        {showElbowDetection && isPoseDetected && (
          <div className="absolute inset-0 pointer-events-none">
            {leftElbow && (
              <div
                className="absolute w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${leftElbow.x * 100}%`,
                  top: `${leftElbow.y * 100}%`,
                }}
              />
            )}
            {rightElbow && (
              <div
                className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${rightElbow.x * 100}%`,
                  top: `${rightElbow.y * 100}%`,
                }}
              />
            )}
          </div>
        )}
        
        <Suspense fallback={<div className="animate-pulse">Loading visualization...</div>}>
          {isWebcamEnabled && isVirtualHandEnabled && (
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
