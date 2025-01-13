import { Landmark } from '../types';

const SMOOTHING_FACTOR = 0.8; // Adjust between 0 and 1 for more/less smoothing
const MIN_VISIBILITY_THRESHOLD = 0.65;

interface LandmarkHistory {
  x: number[];
  y: number[];
  z: number[];
  visibility: number[];
}

class LandmarkProcessor {
  private history: Map<number, LandmarkHistory> = new Map();
  private historySize = 5;

  private smoothValue(values: number[]): number {
    if (values.length === 0) return 0;
    
    const recentValues = values.slice(-this.historySize);
    const sum = recentValues.reduce((acc, val, idx) => {
      const weight = Math.pow(SMOOTHING_FACTOR, recentValues.length - idx - 1);
      return acc + val * weight;
    }, 0);
    
    const weightSum = recentValues.reduce((acc, _, idx) => {
      return acc + Math.pow(SMOOTHING_FACTOR, recentValues.length - idx - 1);
    }, 0);
    
    return sum / weightSum;
  }

  private updateHistory(index: number, landmark: Landmark): void {
    if (!this.history.has(index)) {
      this.history.set(index, {
        x: [],
        y: [],
        z: [],
        visibility: []
      });
    }

    const history = this.history.get(index)!;
    history.x.push(landmark.x);
    history.y.push(landmark.y);
    history.z.push(landmark.z);
    history.visibility.push(landmark.visibility || 0);

    // Keep history size manageable
    if (history.x.length > this.historySize * 2) {
      history.x = history.x.slice(-this.historySize);
      history.y = history.y.slice(-this.historySize);
      history.z = history.z.slice(-this.historySize);
      history.visibility = history.visibility.slice(-this.historySize);
    }
  }

  processLandmarks(landmarks: Landmark[]): Landmark[] {
    return landmarks.map((landmark, index) => {
      // Skip processing if visibility is too low
      if (landmark.visibility && landmark.visibility < MIN_VISIBILITY_THRESHOLD) {
        return landmark;
      }

      this.updateHistory(index, landmark);
      const history = this.history.get(index)!;

      return {
        x: this.smoothValue(history.x),
        y: this.smoothValue(history.y),
        z: this.smoothValue(history.z),
        visibility: this.smoothValue(history.visibility)
      };
    });
  }

  reset(): void {
    this.history.clear();
  }
}

export const landmarkProcessor = new LandmarkProcessor();
