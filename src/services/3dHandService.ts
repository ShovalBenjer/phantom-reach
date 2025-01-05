import * as THREE from 'three';
import { Landmark, HandModel, CalibrationData } from '../types';

export class ThreeDHandService {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private arm: THREE.Group;
  private isInitialized: boolean = false;
  private lastPosition = { x: 0, y: 0, z: 0 };
  private smoothingFactor = 0.1;
  private currentModel: HandModel = 'realistic';

  private readonly modelConfigs = {
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

  constructor(private container: HTMLDivElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.arm = new THREE.Group();
    this.scene.add(this.arm);
  }

  initialize() {
    if (this.isInitialized) return;
    
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);
    
    this.camera.position.z = 5;
    
    this.createArm();
    this.setupLighting();
    
    this.isInitialized = true;
  }

  private setupLighting() {
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemisphereLight.position.set(0, 1, 0);
    
    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    this.scene.add(hemisphereLight);
  }

  private createArm() {
    while(this.arm.children.length > 0) {
      this.arm.remove(this.arm.children[0]);
    }

    const config = this.modelConfigs[this.currentModel];

    // Create upper arm with more realistic proportions
    const upperArmGeometry = new THREE.CylinderGeometry(0.15, 0.12, 1.2, 32);
    const upperArmMaterial = new THREE.MeshPhysicalMaterial({
      color: config.upperArmColor,
      metalness: config.metalness,
      roughness: config.roughness,
      clearcoat: 0.3,
    });
    const upperArm = new THREE.Mesh(upperArmGeometry, upperArmMaterial);
    upperArm.position.y = -0.6;
    this.arm.add(upperArm);

    // Create elbow joint with anatomical shape
    const elbowGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const elbowMaterial = new THREE.MeshPhysicalMaterial({
      color: config.forearmColor,
      metalness: config.metalness,
      roughness: config.roughness,
      clearcoat: 0.3,
    });
    const elbow = new THREE.Mesh(elbowGeometry, elbowMaterial);
    this.arm.add(elbow);

    // Create forearm with muscle definition
    const forearmGeometry = new THREE.CylinderGeometry(0.12, 0.1, 1, 32);
    const forearmMaterial = new THREE.MeshPhysicalMaterial({
      color: config.forearmColor,
      metalness: config.metalness,
      roughness: config.roughness,
      clearcoat: 0.3,
    });
    const forearm = new THREE.Mesh(forearmGeometry, forearmMaterial);
    forearm.position.y = 0.5;
    this.arm.add(forearm);

    // Create anatomically correct hand
    this.createAnatomicalHand(config);
  }

  private createAnatomicalHand(config: any) {
    const handGroup = new THREE.Group();
    handGroup.position.y = 1;

    // Palm
    const palmGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.1);
    const palmMaterial = new THREE.MeshPhysicalMaterial({
      color: config.handColor,
      metalness: config.metalness,
      roughness: config.roughness,
      clearcoat: 0.3,
    });
    const palm = new THREE.Mesh(palmGeometry, palmMaterial);
    handGroup.add(palm);

    // Create anatomically correct fingers
    const fingerPositions = [
      { x: -0.1, y: 0.2, angle: -0.2, length: 0.3 },
      { x: -0.05, y: 0.22, angle: -0.1, length: 0.35 },
      { x: 0, y: 0.23, angle: 0, length: 0.36 },
      { x: 0.05, y: 0.21, angle: 0.1, length: 0.33 },
      { x: 0.1, y: 0.19, angle: 0.2, length: 0.28 }
    ];

    fingerPositions.forEach(pos => {
      const finger = this.createAnatomicalFinger(config, pos.length);
      finger.position.set(pos.x, pos.y, 0);
      finger.rotation.z = pos.angle;
      handGroup.add(finger);
    });

    this.arm.add(handGroup);
  }

  private createAnatomicalFinger(config: any, length: number) {
    const finger = new THREE.Group();
    const segments = 3;
    const segmentLength = length / segments;

    for (let i = 0; i < segments; i++) {
      const segmentGeometry = new THREE.CapsuleGeometry(0.02, segmentLength, 8, 16);
      const segmentMaterial = new THREE.MeshPhysicalMaterial({
        color: config.handColor,
        metalness: config.metalness,
        roughness: config.roughness,
        clearcoat: 0.3,
      });
      const segment = new THREE.Mesh(segmentGeometry, segmentMaterial);
      segment.position.y = i * (segmentLength + 0.01);
      segment.rotation.x = -0.1 * (i + 1);
      finger.add(segment);
    }
    
    return finger;
  }

  updateHandModel(model: HandModel) {
    if (this.currentModel !== model) {
      this.currentModel = model;
      this.createArm();
    }
  }

  updateHandPosition(elbow: Landmark, shoulder: Landmark | null, calibrationData?: CalibrationData) {
    if (!this.isInitialized) return;

    // Calculate position relative to shoulder if available
    const targetX = shoulder ? (elbow.x - shoulder.x) * 10 : (elbow.x - 0.5) * 5;
    const targetY = shoulder ? -(elbow.y - shoulder.y) * 10 : -(elbow.y - 0.5) * 5;
    const targetZ = shoulder ? -((elbow.z - shoulder.z) * 10) : -elbow.z * 5;

    // Apply calibration if available
    if (calibrationData) {
      const { rangeOfMotion } = calibrationData;
      const normalizedX = (targetX - rangeOfMotion.minX) / (rangeOfMotion.maxX - rangeOfMotion.minX);
      const normalizedY = (targetY - rangeOfMotion.minY) / (rangeOfMotion.maxY - rangeOfMotion.minY);
      this.lastPosition.x = normalizedX * 5 - 2.5;
      this.lastPosition.y = normalizedY * 5 - 2.5;
    } else {
      this.lastPosition.x += (targetX - this.lastPosition.x) * this.smoothingFactor;
      this.lastPosition.y += (targetY - this.lastPosition.y) * this.smoothingFactor;
    }
    
    this.lastPosition.z += (targetZ - this.lastPosition.z) * this.smoothingFactor;

    this.arm.position.set(
      this.lastPosition.x,
      this.lastPosition.y,
      this.lastPosition.z
    );

    if (shoulder) {
      const angleX = Math.atan2(elbow.y - shoulder.y, elbow.x - shoulder.x);
      const angleY = Math.atan2(elbow.z - shoulder.z, elbow.x - shoulder.x);
      
      this.arm.rotation.x += (angleX - this.arm.rotation.x) * this.smoothingFactor;
      this.arm.rotation.y += (angleY - this.arm.rotation.y) * this.smoothingFactor;
      this.arm.rotation.z = angleX;
    }

    this.renderer.render(this.scene, this.camera);
  }

  setVisible(visible: boolean) {
    if (!this.isInitialized) return;
    this.arm.visible = visible;
    if (visible) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    if (this.isInitialized) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
      this.isInitialized = false;
    }
  }

  resize() {
    if (!this.isInitialized) return;
    
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
}