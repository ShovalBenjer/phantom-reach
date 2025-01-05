import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { POSE_DETECTION_CONFIG } from '../config/detection';
import { ElbowPositions, Landmark } from '../types';

class PoseDetectionService {
  private poseLandmarker: PoseLandmarker | null = null;
  private lastProcessingTime: number = 0;
  private isProcessing: boolean = false;
  private frameCount: number = 0;
  private lastFpsUpdate: number = 0;
  private fps: number = 0;
  
  // Confidence thresholds for detection
  private readonly MIN_VISIBILITY_THRESHOLD = 0.65;
  private readonly MIN_PRESENCE_CONFIDENCE = 0.75;

  async initialize(): Promise<void> {
    try {
      console.log('[PoseDetection] Initializing MediaPipe Pose Landmarker...');
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );
      
      this.poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: POSE_DETECTION_CONFIG.modelPath,
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: this.MIN_PRESENCE_CONFIDENCE,
        minPosePresenceConfidence: this.MIN_PRESENCE_CONFIDENCE,
        minTrackingConfidence: this.MIN_PRESENCE_CONFIDENCE,
      });

      console.log('[PoseDetection] Successfully initialized pose landmarker');
    } catch (error) {
      console.error('[PoseDetection] Initialization failed:', error);
      throw error;
    }
  }

  private isLandmarkVisible(landmark: Landmark): boolean {
    return (landmark.visibility || 0) > this.MIN_VISIBILITY_THRESHOLD;
  }

  private calculateArmLength(shoulder: Landmark, elbow: Landmark): number {
    return Math.sqrt(
      Math.pow(shoulder.x - elbow.x, 2) +
      Math.pow(shoulder.y - elbow.y, 2) +
      Math.pow(shoulder.z - elbow.z, 2)
    );
  }

  private isArmPresent(shoulder: Landmark, elbow: Landmark): boolean {
    const armLength = this.calculateArmLength(shoulder, elbow);
    const isVisible = this.isLandmarkVisible(shoulder) && this.isLandmarkVisible(elbow);
    // Typical arm length in normalized coordinates should be between 0.1 and 0.4
    return isVisible && armLength > 0.1 && armLength < 0.4;
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
      console.log('[PoseDetection] Processing frame at time:', currentTime);
      const results = await this.poseLandmarker.detectForVideo(video, currentTime);
      this.lastProcessingTime = currentTime;
      
      this.updateFPS(currentTime);

      if (results?.landmarks?.[0]) {
        const landmarks = results.landmarks[0];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const leftElbow = landmarks[13];
        const rightElbow = landmarks[14];

        // Check if arms are present based on visibility and distance
        const leftArmPresent = this.isArmPresent(leftShoulder, leftElbow);
        const rightArmPresent = this.isArmPresent(rightShoulder, rightElbow);

        console.log('[PoseDetection] Arm detection:', {
          leftArmPresent,
          rightArmPresent,
          leftShoulderVisibility: leftShoulder.visibility,
          rightShoulderVisibility: rightShoulder.visibility,
          leftElbowVisibility: leftElbow.visibility,
          rightElbowVisibility: rightElbow.visibility
        });

        return {
          leftElbow: leftArmPresent ? leftElbow : null,
          rightElbow: rightArmPresent ? rightElbow : null,
          leftShoulder: leftArmPresent ? leftShoulder : null,
          rightShoulder: rightArmPresent ? rightShoulder : null,
          landmarks: landmarks,
        };
      }
      
      return null;
    } catch (error) {
      console.error('[PoseDetection] Error detecting poses:', error);
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