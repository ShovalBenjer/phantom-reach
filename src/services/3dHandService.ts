import * as THREE from 'three';
import { Landmark } from '../types';

export class ThreeDHandService {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private hand: THREE.Group;
  private isInitialized: boolean = false;

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
    
    // Set up camera
    this.camera.position.z = 5;
    
    // Create hand parts
    this.createHand();
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    
    this.isInitialized = true;
  }

  private createHand() {
    // Palm
    const palmGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const palmMaterial = new THREE.MeshPhongMaterial({ color: 0xf0c0a0 });
    const palm = new THREE.Mesh(palmGeometry, palmMaterial);
    this.hand.add(palm);

    // Fingers
    const fingerMaterial = new THREE.MeshPhongMaterial({ color: 0xf0c0a0 });
    for (let i = 0; i < 5; i++) {
      const finger = this.createFinger(fingerMaterial);
      finger.position.y = 0.2;
      finger.rotation.z = (Math.PI / 8) * (i - 2);
      this.hand.add(finger);
    }
  }

  private createFinger(material: THREE.Material) {
    const finger = new THREE.Group();
    
    // Create finger segments
    const segmentGeometry = new THREE.CapsuleGeometry(0.05, 0.2, 4, 8);
    
    for (let i = 0; i < 3; i++) {
      const segment = new THREE.Mesh(segmentGeometry, material);
      segment.position.y = i * 0.3;
      finger.add(segment);
    }
    
    return finger;
  }

  updateHandPosition(elbow: Landmark, shoulder: Landmark | null) {
    if (!this.isInitialized) return;

    // Convert 2D coordinates to 3D space
    const x = (elbow.x - 0.5) * 5;
    const y = -(elbow.y - 0.5) * 5;
    const z = -elbow.z * 5;

    this.hand.position.set(x, y, z);

    // Calculate rotation based on shoulder position if available
    if (shoulder) {
      const angle = Math.atan2(elbow.y - shoulder.y, elbow.x - shoulder.x);
      this.hand.rotation.z = angle;
    }

    this.renderer.render(this.scene, this.camera);
  }

  setVisible(visible: boolean) {
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