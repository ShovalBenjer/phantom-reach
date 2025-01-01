import React, { useEffect, useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { AmputationType } from '../types';
import { poseDetectionService } from '../services/poseDetection';
import { VirtualHandService } from '../services/virtualHand';
import { WEBCAM_CONFIG } from '../config/detection';
import { PoseControls } from './pose/PoseControls';

export const PoseDetectionUI: React.FC = () => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [isVirtualHandEnabled, setIsVirtualHandEnabled] = useState(true);
  const [isPoseDetected, setIsPoseDetected] = useState(false);
  const [fps, setFps] = useState(0);
  const [amputationType, setAmputationType] = useState<AmputationType>('left_arm');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const virtualHandServiceRef = useRef<VirtualHandService | null>(null);
  const fpsIntervalRef = useRef<number>();
  const animationFrameRef = useRef<number>();
  const detectionLoopRef = useRef<boolean>(false);

  useEffect(() => {
    if (canvasRef.current) {
      virtualHandServiceRef.current = new VirtualHandService(canvasRef.current);
    }
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
          className={`border-2 border-gray-300 ${isFullscreen ? 'w-full h-full object-contain' : 'w-[640px] h-[480px]'}`}
          autoPlay
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          width={640}
          height={480}
        />
      </div>
    </div>
  );
};