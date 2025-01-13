import { PoseDetectionConfig } from '../types';

export const POSE_DETECTION_CONFIG: PoseDetectionConfig = {
  minPosePresenceConfidence: 0.5,
  minTrackingConfidence: 0.5,
  numPoses: 1,
};

export const WEBCAM_CONFIG = {
  width: 640,
  height: 480,
};