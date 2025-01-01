export interface PoseDetectionConfig {
  modelPath: string;
  minPoseDetectionConfidence: number;
  minPosePresenceConfidence: number;
  minTrackingConfidence: number;
  numPoses: number;
}

export interface Landmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface ElbowPositions {
  leftElbow: Landmark | null;
  rightElbow: Landmark | null;
  landmarks?: Landmark[];
}

export interface HandStyle {
  color: string;
  metalness: number;
  roughness: number;
  radius?: number;
  showVirtualHand?: boolean;
}

export interface CalibrationData {
  armLength: number;
  shoulderWidth: number;
  rangeOfMotion: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export type HandModel = 'realistic' | 'robotic' | 'skeletal' | 'cartoon';

export type AmputationType = 'left_arm' | 'right_arm' | 'both';

export interface HandVisualizationProps {
  isDetectionActive: boolean;
  isVirtualHandEnabled: boolean;
  amputationType: AmputationType;
  leftElbow: Landmark | null;
  rightElbow: Landmark | null;
  leftShoulder: Landmark | null;
  rightShoulder: Landmark | null;
}