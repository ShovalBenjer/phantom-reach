import { PoseDetectionConfig } from '../types';

export const POSE_DETECTION_CONFIG: PoseDetectionConfig = {
  modelPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
  minPoseDetectionConfidence: 0.5,
  minPosePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
  numPoses: 1,
};

export const WEBCAM_CONFIG = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export const FRAME_PROCESSING_INTERVAL = 1000 / 30; // 30 FPS
