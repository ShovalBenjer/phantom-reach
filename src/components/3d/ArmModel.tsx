import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AmputationType } from '@/types';

interface ArmModelProps {
  elbow?: { x: number; y: number; z: number } | null;
  amputationType: AmputationType;
  isEnabled: boolean;
}

export const ArmModel: React.FC<ArmModelProps> = ({ elbow, amputationType, isEnabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const armRef = useRef<THREE.Group | null>(null);
  const fingersRef = useRef<THREE.Group[]>([]);

  useEffect(() => {
    if (!containerRef.current || !isEnabled) return;

    // Initialize Three.js scene
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    
    rendererRef.current = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    rendererRef.current.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    rendererRef.current.shadowMap.enabled = true;
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    sceneRef.current.add(ambientLight);
    sceneRef.current.add(directionalLight);

    // Create enhanced arm model
    createEnhancedArmModel();

    // Position camera
    cameraRef.current.position.z = 5;
    cameraRef.current.position.y = 2;
    cameraRef.current.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      requestAnimationFrame(animate);
      animateFingers();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      disposeScene();
    };
  }, [isEnabled]);

  const createEnhancedArmModel = () => {
    if (!sceneRef.current) return;

    const armGroup = new THREE.Group();

    // Create upper arm (more anatomical shape)
    const upperArmGeometry = new THREE.CylinderGeometry(0.25, 0.2, 2, 32, 8);
    const armMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5d0c5,
      shininess: 30,
      specular: 0x555555
    });
    const upperArm = new THREE.Mesh(upperArmGeometry, armMaterial);
    upperArm.position.y = 1;

    // Create elbow joint (sphere for smooth transition)
    const elbowGeometry = new THREE.SphereGeometry(0.22, 32, 32);
    const elbow = new THREE.Mesh(elbowGeometry, armMaterial);

    // Create forearm (slightly tapered)
    const forearmGeometry = new THREE.CylinderGeometry(0.2, 0.15, 2, 32, 8);
    const forearm = new THREE.Mesh(forearmGeometry, armMaterial);
    forearm.position.y = -1;

    // Create wrist
    const wristGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const wrist = new THREE.Mesh(wristGeometry, armMaterial);
    wrist.position.y = -2;

    // Create hand
    const handGeometry = new THREE.BoxGeometry(0.4, 0.15, 0.8);
    const handMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5d0c5,
      shininess: 30,
      specular: 0x555555
    });
    const hand = new THREE.Mesh(handGeometry, handMaterial);
    hand.position.y = -2.2;

    // Create fingers
    const createFinger = () => {
      const fingerGroup = new THREE.Group();
      const segments = 3;
      let prevSegment: THREE.Mesh | null = null;
      
      for (let i = 0; i < segments; i++) {
        const length = 0.3 - (i * 0.05);
        const radius = 0.04 - (i * 0.01);
        
        const segmentGeometry = new THREE.CylinderGeometry(radius, radius, length, 8);
        const segment = new THREE.Mesh(segmentGeometry, handMaterial);
        
        if (prevSegment) {
          segment.position.y = -length/2;
          prevSegment.add(segment);
        } else {
          segment.position.y = -2.4;
          fingerGroup.add(segment);
        }
        
        prevSegment = segment;
      }
      
      return fingerGroup;
    };

    // Add 5 fingers
    for (let i = 0; i < 5; i++) {
      const finger = createFinger();
      finger.rotation.x = -Math.PI / 2;
      finger.position.x = (i - 2) * 0.08;
      finger.position.z = 0.3;
      fingersRef.current.push(finger);
      armGroup.add(finger);
    }

    // Combine all parts
    armGroup.add(upperArm);
    armGroup.add(elbow);
    armGroup.add(forearm);
    armGroup.add(wrist);
    armGroup.add(hand);

    // Store reference and add to scene
    armRef.current = armGroup;
    sceneRef.current.add(armGroup);
  };

  const animateFingers = () => {
    const time = Date.now() * 0.001;
    fingersRef.current.forEach((finger, index) => {
      const offset = index * 0.5;
      finger.rotation.x = -Math.PI / 2 + Math.sin(time + offset) * 0.2;
    });
  };

  // Update arm position when elbow position changes
  useEffect(() => {
    if (!armRef.current || !elbow) return;
    
    const targetX = (elbow.x - 0.5) * 10;
    const targetY = -(elbow.y - 0.5) * 10;
    const targetZ = elbow.z * 10;

    // Smooth transition to new position
    armRef.current.position.x += (targetX - armRef.current.position.x) * 0.1;
    armRef.current.position.y += (targetY - armRef.current.position.y) * 0.1;
    armRef.current.position.z += (targetZ - armRef.current.position.z) * 0.1;
  }, [elbow]);

  const disposeScene = () => {
    if (!sceneRef.current) return;

    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose();
        if (object.material instanceof THREE.Material) {
          object.material.dispose();
        }
      }
    });
  };

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 pointer-events-none"
      style={{ visibility: isEnabled ? 'visible' : 'hidden' }}
    />
  );
};