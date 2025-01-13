import { Landmark } from '../types';
import { COORDINATE_SYSTEM } from '../config/detection';

export const transformCoordinates = (landmark: Landmark): Landmark => {
  if (!landmark) return landmark;

  return {
    ...landmark,
    x: COORDINATE_SYSTEM.flipX ? 1 - landmark.x : landmark.x,
    y: COORDINATE_SYSTEM.flipY ? 1 - landmark.y : landmark.y,
    z: landmark.z,
    visibility: landmark.visibility,
  };
};

export const transformElbowPositions = (elbows: { leftElbow: Landmark | null; rightElbow: Landmark | null }) => {
  if (COORDINATE_SYSTEM.flipX) {
    // In selfie mode, swap left and right elbows and transform their coordinates
    return {
      leftElbow: elbows.rightElbow ? transformCoordinates(elbows.rightElbow) : null,
      rightElbow: elbows.leftElbow ? transformCoordinates(elbows.leftElbow) : null,
    };
  }
  return elbows;
};