import { PoseDetectionConfig, ElbowPositions } from '../types';
import { POSE_DETECTION_CONFIG } from '../config/detection';
import { toast } from '@/components/ui/use-toast';

class PoseDetectionService {
  private poseLandmarker: any;
  private lastProcessingTime: number = 0;
  private isProcessing: boolean = false;

  async initialize(): Promise<void> {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm'
      );
      
      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: { modelAssetPath: POSE_DETECTION_CONFIG.modelPath },
        runningMode: 'VIDEO',
        numPoses: POSE_DETECTION_CONFIG.numPoses,
        minPoseDetectionConfidence: POSE_DETECTION_CONFIG.minPoseDetectionConfidence,
        minPosePresenceConfidence: POSE_DETECTION_CONFIG.minPosePresenceConfidence,
        minTrackingConfidence: POSE_DETECTION_CONFIG.minTrackingConfidence,
      });

      console.log('Pose detection initialized successfully');
    } catch (error) {
      console.error('Failed to initialize pose detection:', error);
      toast({
        title: "Error",
        description: "Failed to initialize pose detection. Please check your connection and try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async detectElbows(video: HTMLVideoElement): Promise<ElbowPositions | null> {
    if (this.isProcessing) return null;
    
    const currentTime = performance.now();
    if (currentTime - this.lastProcessingTime < 16.67) { // ~60fps limit
      return null;
    }

    this.isProcessing = true;
    try {
      const results = await this.poseLandmarker.detectForVideo(video, currentTime);
      this.lastProcessingTime = currentTime;

      if (results?.landmarks?.[0]) {
        const landmarks = results.landmarks[0];
        return {
          leftElbow: landmarks[13] || null,
          rightElbow: landmarks[14] || null,
        };
      }
      return null;
    } catch (error) {
      console.error('Error detecting poses:', error);
      return null;
    } finally {
      this.isProcessing = false;
    }
  }
}

export const poseDetectionService = new PoseDetectionService();