import React, { useEffect, useRef, useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { AmputationType } from '../types';
import { poseDetectionService } from '../services/poseDetection';
import { VirtualHandService } from '../services/virtualHand';
import { POSE_DETECTION_CONFIG, WEBCAM_CONFIG } from '../config/detection';
import { PoseControls } from './pose/PoseControls';
import { AdvancedControls } from './controls/AdvancedControls';
import { VideoFeed } from './pose/VideoFeed';
import { CanvasOverlay } from './pose/CanvasOverlay';
import { Header } from './pose/Header';
import { LoadingOverlay } from './pose/LoadingOverlay';
import { checkDeviceSupport } from '../utils/deviceDetection';

export const PoseDetectionUI: React.FC = () => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [isVirtualHandEnabled, setIsVirtualHandEnabled] = useState(true);
  const [isPoseDetected, setIsPoseDetected] = useState(false);
  const [fps, setFps] = useState(0);
  const [amputationType, setAmputationType] = useState<AmputationType>('left_arm');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modelComplexity, setModelComplexity] = useState<'Lite' | 'Full' | 'Heavy'>(
    POSE_DETECTION_CONFIG.modelComplexity || 'Lite'
  );
  const [smoothingEnabled, setSmoothingEnabled] = useState(
    POSE_DETECTION_CONFIG.smoothLandmarks || false
  );
  const [segmentationEnabled, setSegmentationEnabled] = useState(
    POSE_DETECTION_CONFIG.enableSegmentation || false
  );
  const [confidenceThreshold, setConfidenceThreshold] = useState(
    POSE_DETECTION_CONFIG.minPoseDetectionConfidence || 0.5
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const virtualHandServiceRef = useRef<VirtualHandService | null>(null);
  const fpsIntervalRef = useRef<number>();
  const animationFrameRef = useRef<number>();
  const detectionLoopRef = useRef<boolean>(false);

  useEffect(() => {
    const isSupported = checkDeviceSupport();
    if (!isSupported) {
      toast({
        title: "Browser Support",
        description: "Some features may be limited in your browser. Chrome is recommended for best experience.",
        variant: "default",
      });
    }
    
    if (canvasRef.current) {
      virtualHandServiceRef.current = new VirtualHandService(canvasRef.current);
    }
    
    startWebcam();
    
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
      setIsLoading(true);
      console.log('Requesting webcam access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { ...WEBCAM_CONFIG, facingMode: "user" },
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
    } finally {
      setIsLoading(false);
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

  const handleModelComplexityChange = async (value: 'Lite' | 'Full' | 'Heavy') => {
    setModelComplexity(value);
    setIsLoading(true);
    try {
      await poseDetectionService.updateConfig({ modelComplexity: value });
      toast({
        title: "Settings Updated",
        description: `Model complexity changed to ${value}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update model complexity",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmoothingToggle = (enabled: boolean) => {
    setSmoothingEnabled(enabled);
    poseDetectionService.updateConfig({ smoothLandmarks: enabled });
  };

  const handleSegmentationToggle = (enabled: boolean) => {
    setSegmentationEnabled(enabled);
    poseDetectionService.updateConfig({ enableSegmentation: enabled });
  };

  const handleConfidenceThresholdChange = (value: number) => {
    setConfidenceThreshold(value);
    poseDetectionService.updateConfig({ minPoseDetectionConfidence: value });
  };

  return (
    <div ref={containerRef} className={`flex flex-col items-center space-y-4 p-6 ${isFullscreen ? 'fixed inset-0 bg-background' : ''}`}>
      <LoadingOverlay isLoading={isLoading} />
      <Header isWebcamEnabled={isWebcamEnabled} fps={fps} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
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
          <AdvancedControls
            modelComplexity={modelComplexity}
            smoothingEnabled={smoothingEnabled}
            segmentationEnabled={segmentationEnabled}
            confidenceThreshold={confidenceThreshold}
            onModelComplexityChange={handleModelComplexityChange}
            onSmoothingToggle={handleSmoothingToggle}
            onSegmentationToggle={handleSegmentationToggle}
            onConfidenceThresholdChange={handleConfidenceThresholdChange}
          />
        )}
      </div>

      <div className={`relative ${isFullscreen ? 'flex-1 w-full flex items-center justify-center' : ''}`}>
        <VideoFeed
          ref={videoRef}
          className={isFullscreen ? 'w-full h-full object-contain' : 'w-[640px] h-[480px]'}
        />
        <CanvasOverlay
          ref={canvasRef}
          width={640}
          height={480}
        />
      </div>
    </div>
  );
};
