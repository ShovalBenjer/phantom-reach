import { Landmark } from '../types';
import { COORDINATE_SYSTEM } from '../config/detection';

const hasGoodVisibility = (landmark: Landmark): boolean => {
  return landmark.visibility !== undefined && landmark.visibility > 0.5;
};

export const transformCoordinates = (landmark: Landmark): Landmark => {
  if (!landmark) return landmark;

  // In selfie mode, flip the x coordinate and adjust for screen space
  return {
    ...landmark,
    x: COORDINATE_SYSTEM.flipX ? 1 - landmark.x : landmark.x,
    y: COORDINATE_SYSTEM.flipY ? 1 - landmark.y : landmark.y,
    z: landmark.z,
    visibility: landmark.visibility,
  };
};

export const transformElbowPositions = (elbows: { leftElbow: Landmark | null; rightElbow: Landmark | null }) => {
  // In selfie mode, swap left and right elbows and transform their coordinates
  if (COORDINATE_SYSTEM.flipX) {
    return {
      leftElbow: elbows.rightElbow ? transformCoordinates(elbows.rightElbow) : null,
      rightElbow: elbows.leftElbow ? transformCoordinates(elbows.leftElbow) : null,
    };
  }
  return elbows;
};

export const smoothLandmarks = (
  current: Landmark,
  previous: Landmark | null,
  smoothingFactor: number = 0.8
): Landmark => {
  if (!previous || !hasGoodVisibility(current)) return current;

  // Apply exponential smoothing to reduce jitter
  return {
    x: previous.x * smoothingFactor + current.x * (1 - smoothingFactor),
    y: previous.y * smoothingFactor + current.y * (1 - smoothingFactor),
    z: previous.z * smoothingFactor + current.z * (1 - smoothingFactor),
    visibility: current.visibility,
  };
};

export const calculateLandmarkVelocity = (
  current: Landmark,
  previous: Landmark | null,
  deltaTime: number
): { x: number; y: number; z: number } => {
  if (!previous) return { x: 0, y: 0, z: 0 };

  return {
    x: (current.x - previous.x) / deltaTime,
    y: (current.y - previous.y) / deltaTime,
    z: (current.z - previous.z) / deltaTime,
  };
};