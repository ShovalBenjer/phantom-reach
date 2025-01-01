import * as THREE from 'three';
import { Landmark, HandModel, CalibrationData } from '../types';

export class ThreeDHandService {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private hand: THREE.Group;
  private isInitialized: boolean = false;
  private lastPosition = { x: 0, y: 0, z: 0 };
  private smoothingFactor = 0.1;
  private currentModel: HandModel = 'realistic';

  private readonly modelConfigs = {
    realistic: {
      color: 0xf0d0c0,
      metalness: 0.1,
      roughness: 0.5,
    },
    robotic: {
      color: 0x808080,
      metalness: 0.8,
      roughness: 0.2,
    },
    skeletal: {
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.7,
    },
    cartoon: {
      color: 0xffb6c1,
      metalness: 0,
      roughness: 1,
    },
  };

  constructor(private container: HTMLDivElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.hand = new THREE.Group();
    this.scene.add(this.hand);
  }

  initialize() {
    if (this.isInitialized) return;
    
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);
    
    this.camera.position.z = 5;
    
    this.createHand();
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

  private createHand() {
    // Clear existing hand
    while(this.hand.children.length > 0) {
      this.hand.remove(this.hand.children[0]);
    }

    const config = this.modelConfigs[this.currentModel];
    const material = new THREE.MeshPhysicalMaterial({
      color: config.color,
      metalness: config.metalness,
      roughness: config.roughness,
    });

    // Create upper arm
    const upperArmGeometry = new THREE.CylinderGeometry(0.2, 0.15, 1, 32);
    const upperArm = new THREE.Mesh(upperArmGeometry, material);
    upperArm.position.y = -0.5;
    this.hand.add(upperArm);

    // Create elbow joint
    const elbowGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const elbow = new THREE.Mesh(elbowGeometry, material);
    elbow.position.y = 0;
    this.hand.add(elbow);

    // Create forearm
    const forearmGeometry = new THREE.CylinderGeometry(0.15, 0.1, 1, 32);
    const forearm = new THREE.Mesh(forearmGeometry, material);
    forearm.position.y = 0.5;
    this.hand.add(forearm);

    // Create wrist
    const wristGeometry = new THREE.SphereGeometry(0.12, 32, 32);
    const wrist = new THREE.Mesh(wristGeometry, material);
    wrist.position.y = 1;
    this.hand.add(wrist);

    // Create hand
    const handGeometry = new THREE.BoxGeometry(0.3, 0.4, 0.1);
    const handMesh = new THREE.Mesh(handGeometry, material);
    handMesh.position.y = 1.2;
    this.hand.add(handMesh);

    // Add fingers
    this.createFingers(material, handMesh);
  }

  private createFingers(material: THREE.Material, handMesh: THREE.Mesh) {
    const fingerPositions = [
      { x: -0.15, y: 0.25, angle: -0.2 },
      { x: -0.08, y: 0.25, angle: 0 },
      { x: 0, y: 0.25, angle: 0 },
      { x: 0.08, y: 0.25, angle: 0 },
      { x: 0.15, y: 0.25, angle: 0.2 }
    ];

    fingerPositions.forEach(pos => {
      const finger = this.createFinger(material);
      finger.position.set(pos.x, pos.y, 0);
      finger.rotation.z = pos.angle;
      handMesh.add(finger);
    });
  }

  private createFinger(material: THREE.Material) {
    const finger = new THREE.Group();
    const segmentGeometry = new THREE.CapsuleGeometry(0.03, 0.15, 8, 16);
    
    for (let i = 0; i < 3; i++) {
      const segment = new THREE.Mesh(segmentGeometry, material);
      segment.position.y = i * 0.2;
      segment.rotation.x = -0.1 * (i + 1);
      finger.add(segment);
    }
    
    return finger;
  }

  updateHandModel(model: HandModel) {
    if (this.currentModel !== model) {
      this.currentModel = model;
      this.createHand();
    }
  }

  updateHandPosition(elbow: Landmark, shoulder: Landmark | null, calibrationData?: CalibrationData) {
    if (!this.isInitialized) return;

    const targetX = (elbow.x - 0.5) * 5;
    const targetY = -(elbow.y - 0.5) * 5;
    const targetZ = -elbow.z * 5;

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

    this.hand.position.set(
      this.lastPosition.x,
      this.lastPosition.y,
      this.lastPosition.z
    );

    if (shoulder) {
      const angleX = Math.atan2(elbow.y - shoulder.y, elbow.x - shoulder.x);
      const angleY = Math.atan2(elbow.z - shoulder.z, elbow.x - shoulder.x);
      
      this.hand.rotation.x += (angleX - this.hand.rotation.x) * this.smoothingFactor;
      this.hand.rotation.y += (angleY - this.hand.rotation.y) * this.smoothingFactor;
      this.hand.rotation.z = angleX;
    }

    this.renderer.render(this.scene, this.camera);
  }

  setVisible(visible: boolean) {
    if (!this.isInitialized) return;
    this.hand.visible = visible;
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
