import React from 'react';
import { toast } from '@/components/ui/use-toast';
import { poseDetectionService } from '../../services/poseDetection';
import { WEBCAM_CONFIG } from '../../config/detection';

interface WebcamInitializerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  setIsWebcamEnabled: (enabled: boolean) => void;
  setIsDetectionActive: (active: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  startPoseDetection: () => void;
}

export const WebcamInitializer: React.FC<WebcamInitializerProps> = ({
  videoRef,
  setIsWebcamEnabled,
  setIsDetectionActive,
  setIsLoading,
  startPoseDetection,
}) => {
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

  return (
    <button onClick={startWebcam} className="bg-primary text-white px-4 py-2 rounded">
      Enable Webcam
    </button>
  );
};