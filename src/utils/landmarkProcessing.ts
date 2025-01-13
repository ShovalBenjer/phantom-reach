import { Landmark } from '../types';

class LandmarkProcessor {
  private readonly historySize = 5;
  private landmarkHistory: Landmark[][] = [];
  private readonly smoothingFactor = 0.8;
  private readonly minVisibility = 0.65;

  reset() {
    this.landmarkHistory = [];
  }

  processLandmarks(landmarks: Landmark[]): Landmark[] {
    // Add new landmarks to history
    this.landmarkHistory.push(landmarks);
    if (this.landmarkHistory.length > this.historySize) {
      this.landmarkHistory.shift();
    }

    // Process each landmark
    return landmarks.map((landmark, index) => {
      // Skip processing if visibility is too low
      if (landmark.visibility && landmark.visibility < this.minVisibility) {
        return landmark;
      }

      // Calculate smoothed position using history
      const smoothedPosition = this.calculateSmoothedPosition(index);
      return {
        ...landmark,
        x: smoothedPosition.x,
        y: smoothedPosition.y,
        z: smoothedPosition.z
      };
    });
  }

  private calculateSmoothedPosition(landmarkIndex: number) {
    if (this.landmarkHistory.length < 2) {
      return this.landmarkHistory[0][landmarkIndex];
    }

    const currentPosition = this.landmarkHistory[this.landmarkHistory.length - 1][landmarkIndex];
    const previousPosition = this.landmarkHistory[this.landmarkHistory.length - 2][landmarkIndex];

    return {
      x: this.smoothValue(previousPosition.x, currentPosition.x),
      y: this.smoothValue(previousPosition.y, currentPosition.y),
      z: this.smoothValue(previousPosition.z, currentPosition.z),
      visibility: currentPosition.visibility
    };
  }

  private smoothValue(previous: number, current: number): number {
    return previous * this.smoothingFactor + current * (1 - this.smoothingFactor);
  }
}

export const landmarkProcessor = new LandmarkProcessor();