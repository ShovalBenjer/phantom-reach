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
      console.log('[PoseDetection] Initializing with config:', POSE_DETECTION_CONFIG);
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

      console.log('[PoseDetection] Successfully initialized pose landmarker:', this.poseLandmarker);
    } catch (error) {
      console.error('[PoseDetection] Initialization failed:', error);
      toast({
        title: "Error",
        description: "Failed to initialize pose detection. Please check your connection and try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async detectElbows(video: HTMLVideoElement): Promise<ElbowPositions | null> {
    if (!this.poseLandmarker || this.isProcessing || !video.videoWidth) {
      console.log('[PoseDetection] Skipping detection:', {
        hasLandmarker: !!this.poseLandmarker,
        isProcessing: this.isProcessing,
        videoWidth: video.videoWidth
      });
      return null;
    }
    
    const currentTime = performance.now();
    if (currentTime - this.lastProcessingTime < 33.33) {
      return null;
    }

    this.isProcessing = true;
    try {
      console.log('[PoseDetection] Processing frame at time:', currentTime);
      const results = await this.poseLandmarker.detectForVideo(video, currentTime);
      this.lastProcessingTime = currentTime;
      
      this.updateFPS(currentTime);

      if (results?.landmarks?.[0]) {
        const landmarks = results.landmarks[0];
        console.log('[PoseDetection] Detected landmarks:', {
          leftElbow: landmarks[13],
          rightElbow: landmarks[14],
          leftShoulder: landmarks[11],
          rightShoulder: landmarks[12]
        });

        return {
          leftElbow: landmarks[13] || null,
          rightElbow: landmarks[14] || null,
          landmarks: landmarks,
        };
      }
      
      console.log('[PoseDetection] No landmarks detected in this frame');
      return null;
    } catch (error) {
      console.error('[PoseDetection] Error detecting poses:', error);
      this.isProcessing = false;
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
      console.log('[PoseDetection] Current FPS:', this.fps);
    }
  }

  getFPS(): number {
    return this.fps;
  }
}

export const poseDetectionService = new PoseDetectionService();