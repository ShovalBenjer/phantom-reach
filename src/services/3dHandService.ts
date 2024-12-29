/**
 * @class ThreeDHandService
 * @description Service that manages 3D hand rendering using Three.js.
 * Handles scene setup, hand model creation, lighting, and animations.
 * 
 * @method initialize - Sets up Three.js scene and hand model
 * @method createRealisticHand - Creates detailed hand geometry with joints
 * @method updateHandPosition - Updates hand position based on pose
 * @method setVisible - Controls hand visibility
 * @method dispose - Cleans up Three.js resources
 * 
 * @property {THREE.Scene} scene - Three.js scene
 * @property {THREE.Group} hand - Hand model group
 * @property {THREE.Mesh[]} joints - Array of joint meshes
 */

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
  private joints: THREE.Mesh[] = [];

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
    
    this.createRealisticHand();
    
    // Enhanced lighting for better visual quality
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(1, 1, 1);
    
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemisphereLight.position.set(0, 1, 0);
    
    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    this.scene.add(hemisphereLight);
    
    this.isInitialized = true;
  }

  private createRealisticHand() {
    // Create palm with more realistic geometry
    const palmGeometry = new THREE.BoxGeometry(0.4, 0.5, 0.2);
    const palmMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf0d0c0,
      metalness: 0.1,
      roughness: 0.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      reflectivity: 0.5,
      envMapIntensity: 0.5
    });
    const palm = new THREE.Mesh(palmGeometry, palmMaterial);
    this.hand.add(palm);

    // Create fingers with enhanced joint system
    const fingerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf0d0c0,
      metalness: 0.1,
      roughness: 0.5,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25
    });

    const fingerPositions = [
      { x: -0.15, y: 0.25, angle: -0.2 }, // Thumb
      { x: -0.08, y: 0.25, angle: 0 },    // Index
      { x: 0, y: 0.25, angle: 0 },        // Middle
      { x: 0.08, y: 0.25, angle: 0 },     // Ring
      { x: 0.15, y: 0.25, angle: 0.2 }    // Pinky
    ];

    fingerPositions.forEach((pos) => {
      const finger = this.createRealisticFinger(fingerMaterial);
      finger.position.set(pos.x, pos.y, 0);
      finger.rotation.z = pos.angle;
      this.hand.add(finger);
    });
  }

  private createRealisticFinger(material: THREE.Material) {
    const finger = new THREE.Group();
    
    // Create more realistic finger segments with proper joints
    const segmentGeometry = new THREE.CapsuleGeometry(0.03, 0.15, 8, 16);
    
    // Create segments with better joint articulation
    for (let i = 0; i < 3; i++) {
      const segment = new THREE.Mesh(segmentGeometry, material);
      segment.position.y = i * 0.2;
      
      // Add subtle curves to fingers for more natural appearance
      segment.rotation.x = -0.1 * (i + 1);
      
      // Create joint spheres for better visual connection
      const jointGeometry = new THREE.SphereGeometry(0.035, 16, 16);
      const joint = new THREE.Mesh(jointGeometry, material);
      joint.position.y = i * 0.2;
      
      this.joints.push(joint);
      finger.add(joint);
      finger.add(segment);
    }
    
    return finger;
  }

  updateHandPosition(elbow: Landmark, shoulder: Landmark | null) {
    if (!this.isInitialized) return;

    // Enhanced position smoothing
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

    // Improved rotation calculation using shoulder position
    if (shoulder) {
      const angleX = Math.atan2(elbow.y - shoulder.y, elbow.x - shoulder.x);
      const angleY = Math.atan2(elbow.z - shoulder.z, elbow.x - shoulder.x);
      
      // Smooth rotation transitions
      this.hand.rotation.x += (angleX - this.hand.rotation.x) * this.smoothingFactor;
      this.hand.rotation.y += (angleY - this.hand.rotation.y) * this.smoothingFactor;
      this.hand.rotation.z = angleX;

      // Animate joints for more natural movement
      this.joints.forEach((joint, index) => {
        joint.rotation.x = Math.sin(Date.now() * 0.002 + index * 0.5) * 0.1;
      });
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
