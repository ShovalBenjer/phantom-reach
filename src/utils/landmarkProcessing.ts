import { Landmark } from '../types';
import { smoothLandmarks } from './coordinateTransform';

class LandmarkProcessor {
  private readonly historySize = 5;
  private landmarkHistory: Landmark[][] = [];
  private readonly smoothingFactor = 0.8;
  private readonly minVisibility = 0.5;

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

      // Get previous landmark for smoothing
      const previousLandmark = this.landmarkHistory.length > 1 
        ? this.landmarkHistory[this.landmarkHistory.length - 2][index]
        : null;

      // Apply smoothing
      return smoothLandmarks(landmark, previousLandmark, this.smoothingFactor);
    });
  }

  // Get the confidence level for a specific landmark
  getLandmarkConfidence(landmark: Landmark): number {
    return landmark.visibility || 0;
  }

  // Check if a landmark's tracking is reliable
  isLandmarkReliable(landmark: Landmark): boolean {
    return this.getLandmarkConfidence(landmark) >= this.minVisibility;
  }
}

export const landmarkProcessor = new LandmarkProcessor();