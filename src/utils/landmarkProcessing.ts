import { Landmark } from '../types';
import { smoothLandmarks, calculateLandmarkVelocity } from './coordinateTransform';

class LandmarkProcessor {
  private readonly historySize = 5;
  private landmarkHistory: Landmark[][] = [];
  private readonly smoothingFactor = 0.8;
  private readonly minVisibility = 0.5;
  private lastProcessingTime: number = 0;

  reset() {
    this.landmarkHistory = [];
    this.lastProcessingTime = 0;
  }

  processLandmarks(landmarks: Landmark[]): Landmark[] {
    const currentTime = performance.now();
    const deltaTime = this.lastProcessingTime ? (currentTime - this.lastProcessingTime) / 1000 : 0;
    this.lastProcessingTime = currentTime;

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

      // Get previous landmark for smoothing
      const previousLandmark = this.landmarkHistory.length > 1 
        ? this.landmarkHistory[this.landmarkHistory.length - 2][index]
        : null;

      // Calculate velocity for prediction
      const velocity = calculateLandmarkVelocity(landmark, previousLandmark, deltaTime);

      // Apply smoothing with velocity-based prediction
      const smoothedLandmark = smoothLandmarks(landmark, previousLandmark, this.smoothingFactor);

      // Apply minimal prediction to reduce latency
      return {
        ...smoothedLandmark,
        x: smoothedLandmark.x + velocity.x * 0.016, // Predict 16ms ahead
        y: smoothedLandmark.y + velocity.y * 0.016,
        z: smoothedLandmark.z + velocity.z * 0.016,
      };
    });
  }

  getLandmarkConfidence(landmark: Landmark): number {
    return landmark.visibility || 0;
  }

  isLandmarkReliable(landmark: Landmark): boolean {
    return this.getLandmarkConfidence(landmark) >= this.minVisibility;
  }
}

export const landmarkProcessor = new LandmarkProcessor();