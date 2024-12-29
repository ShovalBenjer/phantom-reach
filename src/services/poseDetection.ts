import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { POSE_DETECTION_CONFIG } from '../config/detection';
import { toast } from '@/components/ui/use-toast';
import { ElbowPositions } from '../types';

class PoseDetectionService {
  private poseLandmarker: PoseLandmarker | null = null;
  private lastProcessingTime: number = 0;
  private isProcessing: boolean = false;
  private fps: number = 0;
  private lastFpsUpdate: number = 0;
  private frameCount: number = 0;

  async initialize(): Promise<void> {
    try {
      console.log('Initializing pose detection...');
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      
      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: POSE_DETECTION_CONFIG.modelPath,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
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
    if (!this.poseLandmarker || this.isProcessing) return null;
    
    const currentTime = performance.now();
    if (currentTime - this.lastProcessingTime < 33.33) {
      return null;
    }

    this.isProcessing = true;
    try {
      const results = await this.poseLandmarker.detectForVideo(video, currentTime);
      this.lastProcessingTime = currentTime;
      
      // Update FPS counter
      this.frameCount++;
      if (currentTime - this.lastFpsUpdate >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastFpsUpdate = currentTime;
      }

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

  getFPS(): number {
    return this.fps;
  }
}

export const poseDetectionService = new PoseDetectionService();