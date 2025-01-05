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
  private detectionBuffer: ElbowPositions[] = [];
  private readonly bufferSize = 3;

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

  private getStableDetection(detection: ElbowPositions): ElbowPositions {
    this.detectionBuffer.push(detection);
    if (this.detectionBuffer.length > this.bufferSize) {
      this.detectionBuffer.shift();
    }

    // Return most recent detection if buffer isn't full
    if (this.detectionBuffer.length < this.bufferSize) {
      return detection;
    }

    // Return null if any recent detection was null
    const hasNullDetection = this.detectionBuffer.some(d => !d.leftElbow || !d.rightElbow);
    if (hasNullDetection) {
      return detection;
    }

    // Average the last few detections for stability
    const avgDetection: ElbowPositions = {
      leftElbow: {
        x: 0,
        y: 0,
        z: 0,
        visibility: 0
      },
      rightElbow: {
        x: 0,
        y: 0,
        z: 0,
        visibility: 0
      },
      landmarks: detection.landmarks
    };

    this.detectionBuffer.forEach(d => {
      if (d.leftElbow && d.rightElbow) {
        avgDetection.leftElbow!.x += d.leftElbow.x / this.bufferSize;
        avgDetection.leftElbow!.y += d.leftElbow.y / this.bufferSize;
        avgDetection.leftElbow!.z += d.leftElbow.z / this.bufferSize;
        avgDetection.leftElbow!.visibility! += (d.leftElbow.visibility || 0) / this.bufferSize;

        avgDetection.rightElbow!.x += d.rightElbow.x / this.bufferSize;
        avgDetection.rightElbow!.y += d.rightElbow.y / this.bufferSize;
        avgDetection.rightElbow!.z += d.rightElbow.z / this.bufferSize;
        avgDetection.rightElbow!.visibility! += (d.rightElbow.visibility || 0) / this.bufferSize;
      }
    });

    return avgDetection;
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
    if (currentTime - this.lastProcessingTime < 33.33) { // Limit to ~30 FPS
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
        const detection = {
          leftElbow: landmarks[13] || null,
          rightElbow: landmarks[14] || null,
          landmarks: landmarks,
        };

        console.log('[PoseDetection] Detected landmarks:', {
          leftElbow: landmarks[13],
          rightElbow: landmarks[14],
          leftShoulder: landmarks[11],
          rightShoulder: landmarks[12]
        });

        return this.getStableDetection(detection);
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