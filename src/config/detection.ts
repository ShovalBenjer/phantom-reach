export const POSE_DETECTION_CONFIG = {
  modelPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
  minPoseDetectionConfidence: 0.75,
  minPosePresenceConfidence: 0.75,
  minTrackingConfidence: 0.75,
  numPoses: 1,
  runningMode: "VIDEO"
};

export const WEBCAM_CONFIG = {
  width: 640,
  height: 480,
  facingMode: "user",
};

export const FRAME_PROCESSING_INTERVAL = 1000 / 30; // 30 FPS

export const DETECTION_SMOOTHING = {
  bufferSize: 5,
  minVisibilityThreshold: 0.65,
};