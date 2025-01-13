import React, { useRef, useState } from 'react';
import { checkDeviceSupport } from '../../utils/deviceDetection';
import { toast } from '@/components/ui/use-toast';
import { AmputationType } from '../../types';
import { POSE_DETECTION_CONFIG } from '../../config/detection';
import { poseDetectionService } from '../../services/poseDetection';
import { DetectionLogic } from './DetectionLogic';
import { PoseControls } from '../pose/PoseControls';
import { AdvancedControls } from '../controls/AdvancedControls';
import { VideoFeed } from '../pose/VideoFeed';
import { CanvasOverlay } from '../pose/CanvasOverlay';
import { Header } from '../pose/Header';
import { LoadingOverlay } from '../pose/LoadingOverlay';
import { VisualEffects } from '../effects/VisualEffects';
import { ArmModel } from '../3d/ArmModel';

export const MainContainer: React.FC = () => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [isDetectionActive, setIsDetectionActive] = useState(false);
  const [isVirtualHandEnabled, setIsVirtualHandEnabled] = useState(true);
  const [isPoseDetected, setIsPoseDetected] = useState(false);
  const [fps, setFps] = useState(0);
  const [amputationType, setAmputationType] = useState<AmputationType>('left_arm');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modelComplexity, setModelComplexity] = useState<'Lite' | 'Full' | 'Heavy'>(
    POSE_DETECTION_CONFIG.modelComplexity as 'Lite' | 'Full' | 'Heavy'
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

  const [currentElbowPositions, setCurrentElbowPositions] = useState<{
    leftElbow?: { x: number; y: number; z: number } | null;
    rightElbow?: { x: number; y: number; z: number } | null;
  }>({});

  React.useEffect(() => {
    const isSupported = checkDeviceSupport();
    if (!isSupported) {
      toast({
        title: "Browser Support",
        description: "Some features may be limited in your browser. Chrome is recommended for best experience.",
        variant: "default",
      });
    }
  }, []);

  const toggleDetection = () => {
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
    <div ref={containerRef} className="flex flex-col items-center space-y-4 p-6">
      <LoadingOverlay isLoading={isLoading} />
      
      <DetectionLogic
        videoRef={videoRef}
        canvasRef={canvasRef}
        isDetectionActive={isDetectionActive}
        isVirtualHandEnabled={isVirtualHandEnabled}
        amputationType={amputationType}
        setIsPoseDetected={setIsPoseDetected}
        setCurrentElbowPositions={setCurrentElbowPositions}
        setFps={setFps}
      />
      
      {!isFullscreen && (
        <>
          <Header isWebcamEnabled={isWebcamEnabled} fps={fps} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
            <PoseControls 
              isWebcamEnabled={isWebcamEnabled}
              isDetectionActive={isDetectionActive}
              isVirtualHandEnabled={isVirtualHandEnabled}
              isFullscreen={isFullscreen}
              amputationType={amputationType}
              onStartWebcam={() => {}}
              onToggleDetection={toggleDetection}
              onToggleVirtualHand={toggleVirtualHand}
              onToggleFullscreen={toggleFullscreen}
              onAmputationTypeChange={setAmputationType}
            />

            {isWebcamEnabled && (
              <div className="relative flex justify-end">
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
              </div>
            )}
          </div>
        </>
      )}

      <div className={`relative ${isFullscreen ? 'fixed inset-0 bg-black flex items-center justify-center' : ''}`}>
        <VideoFeed
          ref={videoRef}
          className={isFullscreen ? 'w-full h-full object-contain' : 'w-[640px] h-[480px]'}
        />
        <CanvasOverlay
          ref={canvasRef}
          width={640}
          height={480}
          className={isFullscreen ? 'w-full h-full' : ''}
        />
        <ArmModel 
          elbow={amputationType === 'left_arm' ? currentElbowPositions.leftElbow : currentElbowPositions.rightElbow}
          amputationType={amputationType}
          isEnabled={isVirtualHandEnabled}
        />
        <VisualEffects 
          isPoseDetected={isPoseDetected}
          isProcessing={isLoading}
          elbowPositions={currentElbowPositions}
        />
      </div>
    </div>
  );
};