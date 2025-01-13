import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { POSE_DETECTION_CONFIG, FRAME_PROCESSING_CONFIG } from '../config/detection';
import { toast } from '@/components/ui/use-toast';
import { ElbowPositions, PoseDetectionConfig } from '../types';
import { transformElbowPositions } from '../utils/coordinateTransform';

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
    
    // If the update requires model reinitialization
    if (newConfig.modelComplexity || newConfig.modelPath) {
      await this.initialize();
    }
  }

  async detectElbows(video: HTMLVideoElement): Promise<ElbowPositions | null> {
    if (!this.poseLandmarker || this.isProcessing || !video.videoWidth) {
      console.log('Skipping detection:', {
        hasLandmarker: !!this.poseLandmarker,
        isProcessing: this.isProcessing,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        videoReadyState: video.readyState
      });
      return null;
    }
    
    const currentTime = performance.now();
    if (currentTime - this.lastProcessingTime < 33.33) { // Limit to ~30 FPS
      return null;
    }

    this.isProcessing = true;
    try {
      console.log('Detecting poses on video:', {
        time: currentTime,
        videoSize: `${video.videoWidth}x${video.videoHeight}`
      });
      
      const results = await this.poseLandmarker.detectForVideo(video, currentTime);
      this.lastProcessingTime = currentTime;
      
      // Update FPS counter
      this.frameCount++;
      if (currentTime - this.lastFpsUpdate >= 1000) {
        this.fps = this.frameCount;
        this.frameCount = 0;
        this.lastFpsUpdate = currentTime;
        console.log('Current FPS:', this.fps);
      }

      if (results?.landmarks?.[0]) {
        console.log('Pose landmarks detected:', results.landmarks[0]);
        const landmarks = results.landmarks[0];
        return {
          leftElbow: landmarks[13] || null,  // Left elbow landmark index
          rightElbow: landmarks[14] || null, // Right elbow landmark index
        };
      }
      
      console.log('No pose detected in results:', results);
      return null;
    } catch (error) {
      console.error('Error detecting poses:', error);
      this.isProcessing = false;
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  getFPS(): number {
    return this.fps;
  }
}

export const poseDetectionService = new PoseDetectionService();
