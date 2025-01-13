import * as THREE from 'three';
import { HandModel } from '../../types';

export class HandModelService {
  private modelConfigs = {
    realistic: {
      color: 0xf0d0c0,
      metalness: 0.2,
      roughness: 0.7,
      clearcoat: 0.3,
      transmission: 0.2,
    },
    robotic: {
      color: 0x808080,
      metalness: 0.8,
      roughness: 0.2,
      clearcoat: 0.5,
      transmission: 0.0,
    },
    skeletal: {
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.7,
      clearcoat: 0.1,
      transmission: 0.1,
    },
    cartoon: {
      color: 0xffb6c1,
      metalness: 0.0,
      roughness: 1.0,
      clearcoat: 0.0,
      transmission: 0.0,
    },
  };

  createArm(model: HandModel, scene: THREE.Scene): THREE.Group {
    const config = this.modelConfigs[model];
    const arm = new THREE.Group();

    // Create upper arm with PBR material
    const upperArmGeometry = new THREE.CylinderGeometry(0.15, 0.12, 1.2, 32);
    const upperArmMaterial = new THREE.MeshPhysicalMaterial({
      color: config.color,
      metalness: config.metalness,
      roughness: config.roughness,
      clearcoat: config.clearcoat,
      clearcoatRoughness: 0.25,
      transmission: config.transmission,
      thickness: 0.5,
      attenuationColor: new THREE.Color(1.0, 0.2, 0.1),
      attenuationDistance: 0.5,
    });

    const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    upperArm.position.y = -0.6;
    arm.add(upperArm);

    // Create elbow joint with same material
    const elbowGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const elbow = new THREE.Mesh(elbowGeometry, upperArmMaterial.clone());
    arm.add(elbow);

    return arm;
  }
}