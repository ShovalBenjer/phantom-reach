import * as THREE from 'three';
import { Landmark } from '../types';

export class ThreeDHandService {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private hand: THREE.Group;
  private isInitialized: boolean = false;
  private lastPosition = { x: 0, y: 0, z: 0 };
  private smoothingFactor = 0.1;

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
    
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    
    this.isInitialized = true;
  }

  private createHand() {
    // Create palm
    const palmGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.2);
    const palmMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf0d0c0,
      shininess: 30,
      specular: 0x555555
    });
    const palm = new THREE.Mesh(palmGeometry, palmMaterial);
    this.hand.add(palm);

    // Create fingers with joints
    const fingerMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf0d0c0,
      shininess: 30,
      specular: 0x555555
    });

    const fingerPositions = [
      { x: -0.15, angle: -0.2 }, // Thumb
      { x: -0.08, angle: 0 },    // Index
      { x: 0, angle: 0 },        // Middle
      { x: 0.08, angle: 0 },     // Ring
      { x: 0.15, angle: 0.2 }    // Pinky
    ];

    fingerPositions.forEach((pos) => {
      const finger = this.createFinger(fingerMaterial);
      finger.position.x = pos.x;
      finger.position.y = 0.25;
      finger.rotation.z = pos.angle;
      this.hand.add(finger);
    });
  }

  private createFinger(material: THREE.Material) {
    const finger = new THREE.Group();
    
    // Create segments with joints
    const segmentGeometry = new THREE.CapsuleGeometry(0.03, 0.15, 4, 8);
    
    for (let i = 0; i < 3; i++) {
      const segment = new THREE.Mesh(segmentGeometry, material);
      segment.position.y = i * 0.2;
      segment.rotation.x = -0.1; // Slight curve
      finger.add(segment);
    }
    
    return finger;
  }

  updateHandPosition(elbow: Landmark, shoulder: Landmark | null) {
    if (!this.isInitialized) return;

    // Convert coordinates and apply smoothing
    const targetX = (elbow.x - 0.5) * 5;
    const targetY = -(elbow.y - 0.5) * 5;
    const targetZ = -elbow.z * 5;

    this.lastPosition.x += (targetX - this.lastPosition.x) * this.smoothingFactor;
    this.lastPosition.y += (targetY - this.lastPosition.y) * this.smoothingFactor;
    this.lastPosition.z += (targetZ - this.lastPosition.z) * this.smoothingFactor;

    this.hand.position.set(
      this.lastPosition.x,
      this.lastPosition.y,
      this.lastPosition.z
    );

    // Calculate rotation based on shoulder position
    if (shoulder) {
      const angleX = Math.atan2(elbow.y - shoulder.y, elbow.x - shoulder.x);
      const angleY = Math.atan2(elbow.z - shoulder.z, elbow.x - shoulder.x);
      
      // Smooth rotation
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