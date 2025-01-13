import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { POSE_DETECTION_CONFIG, FRAME_PROCESSING_CONFIG } from '../config/detection';
import { toast } from '@/components/ui/use-toast';
import { ElbowPositions, PoseDetectionConfig } from '../types';
import { transformElbowPositions } from '../utils/coordinateTransform';
import { landmarkProcessor } from '../utils/landmarkProcessing';

class PoseDetectionService {
  private poseLandmarker: PoseLandmarker | null = null;
  private lastProcessingTime: number = 0;
  private isProcessing: boolean = false;
  private fps: number = 0;
  private lastFpsUpdate: number = 0;
  private frameCount: number = 0;
  private currentConfig: PoseDetectionConfig = POSE_DETECTION_CONFIG;

  async initialize(): Promise<void> {
    try {
      console.log('Initializing pose detection with config:', this.currentConfig);
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      
      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: this.currentConfig.modelPath,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: this.currentConfig.numPoses,
        minPoseDetectionConfidence: this.currentConfig.minPoseDetectionConfidence,
        minPosePresenceConfidence: this.currentConfig.minPosePresenceConfidence,
        minTrackingConfidence: this.currentConfig.minTrackingConfidence,
      });

      console.log('Pose detection initialized successfully:', this.poseLandmarker);
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

  async updateConfig(newConfig: Partial<PoseDetectionConfig>): Promise<void> {
    this.currentConfig = { ...this.currentConfig, ...newConfig };
    landmarkProcessor.reset();
    
    if (newConfig.modelComplexity || newConfig.modelPath) {
      await this.initialize();
    }
  }

  async detectElbows(video: HTMLVideoElement): Promise<ElbowPositions | null> {
    if (!this.poseLandmarker || this.isProcessing || !video.videoWidth) {
      return null;
    }
    
    const currentTime = performance.now();
    if (currentTime - this.lastProcessingTime < FRAME_PROCESSING_CONFIG.interval) {
      return null;
    }

    this.isProcessing = true;
    try {
      const results = await this.poseLandmarker.detectForVideo(video, currentTime);
      this.lastProcessingTime = currentTime;
      
      this.updateFPS(currentTime);

      if (results?.landmarks?.[0]) {
        const processedLandmarks = this.currentConfig.smoothLandmarks 
          ? landmarkProcessor.processLandmarks(results.landmarks[0])
          : results.landmarks[0];

        const elbowPositions = {
          leftElbow: processedLandmarks[13] || null,  // Left elbow landmark index
          rightElbow: processedLandmarks[14] || null, // Right elbow landmark index
        };

        console.log('Elbows detected:', elbowPositions);
        return elbowPositions;
      }
      
      return null;
    } catch (error) {
      console.error('Error detecting poses:', error);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  private updateFPS(currentTime: number): void {
    this.frameCount++;
    if (currentTime - this.lastFpsUpdate >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
      console.log('Current FPS:', this.fps);
    }
  }

  getFPS(): number {
    return this.fps;
  }
}

export const poseDetectionService = new PoseDetectionService();