import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision';
import { POSE_DETECTION_CONFIG, DETECTION_SMOOTHING } from '../config/detection';
import { toast } from '@/hooks/use-toast';
import { ElbowPositions, Landmark } from '../types';

class PoseDetectionService {
  private poseLandmarker: PoseLandmarker | null = null;
  private lastProcessingTime: number = 0;
  private isProcessing: boolean = false;
  private fps: number = 0;
  private lastFpsUpdate: number = 0;
  private frameCount: number = 0;
  private detectionBuffer: ElbowPositions[] = [];

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

      console.log('[PoseDetection] Successfully initialized pose landmarker');
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

  private isLandmarkVisible(landmark: Landmark): boolean {
    return (landmark.visibility || 0) > DETECTION_SMOOTHING.minVisibilityThreshold;
  }

  private smoothLandmarks(detection: ElbowPositions): ElbowPositions {
    this.detectionBuffer.push(detection);
    if (this.detectionBuffer.length > DETECTION_SMOOTHING.bufferSize) {
      this.detectionBuffer.shift();
    }

    const visibleDetections = this.detectionBuffer.filter(d => 
      d.leftElbow && d.rightElbow && 
      this.isLandmarkVisible(d.leftElbow) && 
      this.isLandmarkVisible(d.rightElbow)
    );

    if (visibleDetections.length < 2) {
      return detection;
    }

    const smoothed: ElbowPositions = {
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

    const count = visibleDetections.length;
    visibleDetections.forEach(d => {
      if (d.leftElbow && d.rightElbow) {
        ['leftElbow', 'rightElbow'].forEach(key => {
          const landmark = d[key as keyof Pick<ElbowPositions, 'leftElbow' | 'rightElbow'>];
          if (landmark) {
            smoothed[key as keyof Pick<ElbowPositions, 'leftElbow' | 'rightElbow'>] = {
              x: (smoothed[key as keyof Pick<ElbowPositions, 'leftElbow' | 'rightElbow'>]?.x || 0) + landmark.x / count,
              y: (smoothed[key as keyof Pick<ElbowPositions, 'leftElbow' | 'rightElbow'>]?.y || 0) + landmark.y / count,
              z: (smoothed[key as keyof Pick<ElbowPositions, 'leftElbow' | 'rightElbow'>]?.z || 0) + landmark.z / count,
              visibility: (smoothed[key as keyof Pick<ElbowPositions, 'leftElbow' | 'rightElbow'>]?.visibility || 0) + (landmark.visibility || 0) / count,
            };
          }
        });
      }
    });

    return smoothed;
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
        const detection = {
          leftElbow: landmarks[13] || null,
          rightElbow: landmarks[14] || null,
          leftShoulder: landmarks[11] || null,
          rightShoulder: landmarks[12] || null,
          landmarks: landmarks,
        };

        console.log('[PoseDetection] Detected landmarks:', detection);
        return this.smoothLandmarks(detection);
      }
      
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