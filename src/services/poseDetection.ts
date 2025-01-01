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
  private frameBuffer: Array<ElbowPositions | null> = [];
  private readonly BUFFER_SIZE = 5;

  async initialize(): Promise<void> {
    try {
      console.log('Initializing pose detection with config:', POSE_DETECTION_CONFIG);
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

  private smoothPoseData(currentPose: ElbowPositions | null): ElbowPositions | null {
    this.frameBuffer.push(currentPose);
    if (this.frameBuffer.length > this.BUFFER_SIZE) {
      this.frameBuffer.shift();
    }

    if (this.frameBuffer.length < this.BUFFER_SIZE) {
      return currentPose;
    }

    const validFrames = this.frameBuffer.filter(frame => frame !== null) as ElbowPositions[];
    if (validFrames.length === 0) return null;

    const smoothedPose: ElbowPositions = {
      leftElbow: validFrames[0].leftElbow ? {
        x: validFrames.reduce((sum, frame) => sum + (frame.leftElbow?.x || 0), 0) / validFrames.length,
        y: validFrames.reduce((sum, frame) => sum + (frame.leftElbow?.y || 0), 0) / validFrames.length,
        z: validFrames.reduce((sum, frame) => sum + (frame.leftElbow?.z || 0), 0) / validFrames.length,
      } : null,
      rightElbow: validFrames[0].rightElbow ? {
        x: validFrames.reduce((sum, frame) => sum + (frame.rightElbow?.x || 0), 0) / validFrames.length,
        y: validFrames.reduce((sum, frame) => sum + (frame.rightElbow?.y || 0), 0) / validFrames.length,
        z: validFrames.reduce((sum, frame) => sum + (frame.rightElbow?.z || 0), 0) / validFrames.length,
      } : null,
      landmarks: validFrames[0].landmarks
    };

    return smoothedPose;
  }

  async detectElbows(video: HTMLVideoElement): Promise<ElbowPositions | null> {
    if (!this.poseLandmarker || this.isProcessing || !video.videoWidth) {
      return null;
    }
    
    const currentTime = performance.now();
    if (currentTime - this.lastProcessingTime < 33.33) { // Limit to ~30 FPS
      return null;
    }

    this.isProcessing = true;
    try {
      const results = await this.poseLandmarker.detectForVideo(video, currentTime);
      this.lastProcessingTime = currentTime;
      
      this.updateFPS(currentTime);

      if (results?.landmarks?.[0]) {
        const rawPose = {
          leftElbow: results.landmarks[0][13] || null,
          rightElbow: results.landmarks[0][14] || null,
          landmarks: results.landmarks[0],
        };
        
        return this.smoothPoseData(rawPose);
      }
      
      return this.smoothPoseData(null);
    } catch (error) {
      console.error('Error detecting poses:', error);
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
      console.log('Current FPS:', this.fps);
    }
  }

  getFPS(): number {
    return this.fps;
  }
}

export const poseDetectionService = new PoseDetectionService();