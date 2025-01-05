import * as THREE from 'three';
import { HandModel } from '../../types';

export class HandModelService {
  private modelConfigs = {
    realistic: {
      upperArmColor: 0xf0d0c0,
      forearmColor: 0xe5c5b5,
      handColor: 0xdbb7a7,
      metalness: 0.2,
      roughness: 0.7,
    },
    robotic: {
      upperArmColor: 0x808080,
      forearmColor: 0x707070,
      handColor: 0x606060,
      metalness: 0.8,
      roughness: 0.2,
    },
    skeletal: {
      upperArmColor: 0xffffff,
      forearmColor: 0xf5f5f5,
      handColor: 0xefefef,
      metalness: 0.3,
      roughness: 0.7,
    },
    cartoon: {
      upperArmColor: 0xffb6c1,
      forearmColor: 0xffc0cb,
      handColor: 0xffd1dc,
      metalness: 0,
      roughness: 1,
    },
  };

  createArm(model: HandModel, scene: THREE.Scene): THREE.Group {
    const arm = new THREE.Group();
    const config = this.modelConfigs[model];

    // Create upper arm
    const upperArmGeometry = new THREE.CylinderGeometry(0.15, 0.12, 1.2, 32);
    const upperArmMaterial = new THREE.MeshPhysicalMaterial({
      color: config.upperArmColor,
      metalness: config.metalness,
      roughness: config.roughness,
      clearcoat: 0.3,
    });
    const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    upperArm.position.y = -0.6;
    arm.add(upperArm);

    // Create elbow joint
    const elbowGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const elbowMaterial = new THREE.MeshPhysicalMaterial({
      color: config.forearmColor,
      metalness: config.metalness,
      roughness: config.roughness,
      clearcoat: 0.3,
    });
    const elbow = new THREE.Mesh(elbowGeometry, elbowMaterial);
    arm.add(elbow);

    return arm;
  }
}