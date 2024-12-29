import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { AmputationType } from '../types';
import { poseDetectionService } from '../services/poseDetection';
import { VirtualHandService } from '../services/virtualHand';
import { WEBCAM_CONFIG } from '../config/detection';

export const PoseDetectionUI: React.FC = () => {
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [amputationType, setAmputationType] = useState<AmputationType>('left_arm');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const virtualHandServiceRef = useRef<VirtualHandService | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      virtualHandServiceRef.current = new VirtualHandService(canvasRef.current);
    }
    return () => {
      virtualHandServiceRef.current?.dispose();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: WEBCAM_CONFIG,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamEnabled(true);
        await poseDetectionService.initialize();
        startPoseDetection();
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

  const startPoseDetection = () => {
    if (!videoRef.current || !virtualHandServiceRef.current) return;

    const detectFrame = async () => {
      const elbows = await poseDetectionService.detectElbows(videoRef.current!);
      
      if (elbows) {
        virtualHandServiceRef.current?.clearCanvas();
        
        if (amputationType === 'left_arm' || amputationType === 'both') {
          virtualHandServiceRef.current?.renderHand(elbows.leftElbow, { color: 'rgba(255, 0, 0, 0.6)' });
        }
        if (amputationType === 'right_arm' || amputationType === 'both') {
          virtualHandServiceRef.current?.renderHand(elbows.rightElbow, { color: 'rgba(0, 255, 0, 0.6)' });
        }
      }

      requestAnimationFrame(detectFrame);
    };

    detectFrame();
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <Select value={amputationType} onValueChange={(value: AmputationType) => setAmputationType(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select amputation type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="left_arm">Left Arm</SelectItem>
          <SelectItem value="right_arm">Right Arm</SelectItem>
          <SelectItem value="both">Both Arms</SelectItem>
        </SelectContent>
      </Select>

      <Button
        onClick={startWebcam}
        disabled={isWebcamEnabled}
        className="bg-primary hover:bg-primary/90"
      >
        {isWebcamEnabled ? 'Webcam Enabled' : 'Enable Webcam'}
      </Button>

      <div className="relative">
        <video
          ref={videoRef}
          className="w-[640px] h-[480px] border-2 border-gray-300"
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