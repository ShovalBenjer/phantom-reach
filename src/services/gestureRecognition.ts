import { Landmark } from '../types';

export type Gesture = 'open' | 'closed' | 'pointing' | 'peace' | 'thumbsUp';

export interface GestureResult {
  gesture: Gesture;
  confidence: number;
}

class GestureRecognitionService {
  private lastGesture: Gesture | null = null;
  private confidenceThreshold = 0.7;

  detectGesture(landmarks: Landmark[]): GestureResult | null {
    if (!landmarks || landmarks.length < 21) return null;

    // Calculate distances and angles between landmarks
    const palmWidth = this.calculateDistance(landmarks[0], landmarks[5]);
    const fingerExtension = this.calculateFingerExtensions(landmarks);
    
    // Determine gesture based on finger positions
    let gesture: Gesture = 'open';
    let confidence = 0.8;

    if (fingerExtension.every(ext => ext < 0.3)) {
      gesture = 'closed';
      confidence = 0.9;
    } else if (fingerExtension[1] > 0.8 && fingerExtension.slice(2).every(ext => ext < 0.3)) {
      gesture = 'pointing';
      confidence = 0.85;
    } else if (fingerExtension[1] > 0.8 && fingerExtension[2] > 0.8) {
      gesture = 'peace';
      confidence = 0.85;
    } else if (fingerExtension[0] > 0.8 && fingerExtension.slice(1).every(ext => ext < 0.3)) {
      gesture = 'thumbsUp';
      confidence = 0.9;
    }

    if (confidence >= this.confidenceThreshold) {
      this.lastGesture = gesture;
      return { gesture, confidence };
    }

    return null;
  }

  private calculateDistance(a: Landmark, b: Landmark): number {
    return Math.sqrt(
      Math.pow(b.x - a.x, 2) + 
      Math.pow(b.y - a.y, 2) + 
      Math.pow(b.z - a.z, 2)
    );
  }

  private calculateFingerExtensions(landmarks: Landmark[]): number[] {
    // Calculate extension ratio for each finger (0-1)
    return [
      this.calculateFingerExtension(landmarks, [2, 3, 4]),      // Thumb
      this.calculateFingerExtension(landmarks, [6, 7, 8]),      // Index
      this.calculateFingerExtension(landmarks, [10, 11, 12]),   // Middle
      this.calculateFingerExtension(landmarks, [14, 15, 16]),   // Ring
      this.calculateFingerExtension(landmarks, [18, 19, 20]),   // Pinky
    ];
  }

  private calculateFingerExtension(landmarks: Landmark[], fingerIndices: number[]): number {
    const totalLength = fingerIndices.reduce((acc, curr, idx) => {
      if (idx === 0) return 0;
      return acc + this.calculateDistance(landmarks[fingerIndices[idx - 1]], landmarks[curr]);
    }, 0);

    const straightLength = this.calculateDistance(
      landmarks[fingerIndices[0]], 
      landmarks[fingerIndices[fingerIndices.length - 1]]
    );

    return straightLength / totalLength;
  }
}

export const gestureRecognitionService = new GestureRecognitionService();