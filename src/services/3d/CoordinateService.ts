import * as THREE from 'three';
import { Landmark } from '../../types';

export class CoordinateService {
  private readonly smoothingFactor = 0.1;
  private lastPosition = new THREE.Vector3();

  calculateArmPosition(elbow: Landmark, shoulder: Landmark | null): THREE.Vector3 {
    // Calculate position relative to shoulder if available
    const targetX = shoulder ? (elbow.x - shoulder.x) * 10 : (elbow.x - 0.5) * 5;
    const targetY = shoulder ? -(elbow.y - shoulder.y) * 10 : -(elbow.y - 0.5) * 5;
    const targetZ = shoulder ? -((elbow.z - shoulder.z) * 10) : -elbow.z * 5;

    // Apply smoothing
    this.lastPosition.x += (targetX - this.lastPosition.x) * this.smoothingFactor;
    this.lastPosition.y += (targetY - this.lastPosition.y) * this.smoothingFactor;
    this.lastPosition.z += (targetZ - this.lastPosition.z) * this.smoothingFactor;

    return this.lastPosition.clone();
  }

  calculateArmRotation(elbow: Landmark, shoulder: Landmark | null): THREE.Euler {
    if (!shoulder) return new THREE.Euler();

    const angleX = Math.atan2(elbow.y - shoulder.y, elbow.x - shoulder.x);
    const angleY = Math.atan2(elbow.z - shoulder.z, elbow.x - shoulder.x);
    const angleZ = angleX;

    return new THREE.Euler(angleX, angleY, angleZ);
  }
}