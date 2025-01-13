export const POSE_DETECTION_CONFIG = {
  modelPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
  minPoseDetectionConfidence: 0.5,
  minPosePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
  numPoses: 1,
  modelComplexity: 'Lite',
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: true,
};

export const WEBCAM_CONFIG = {
  width: 640,
  height: 480,
  facingMode: "user", // This ensures selfie mode by default
};

export const COORDINATE_SYSTEM = {
  flipX: true, // For mirroring in selfie mode
  flipY: false,
};

export const FRAME_PROCESSING_CONFIG = {
  targetFPS: 30,
  interval: 1000 / 30, // 30 FPS
  smoothingFactor: 0.8, // For landmark smoothing
};