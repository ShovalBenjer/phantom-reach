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
    
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(rendererRef.current.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    sceneRef.current.add(ambientLight);
    sceneRef.current.add(directionalLight);

    // Create arm model
    createArmModel();

    // Position camera
    cameraRef.current.position.z = 5;

    // Animation loop
    const animate = () => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;
      
      requestAnimationFrame(animate);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };
    animate();

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      disposeScene();
    };
  }, [isEnabled]);

  // Update arm position when elbow position changes
  useEffect(() => {
    if (!armRef.current || !elbow) return;
    
    armRef.current.position.set(
      (elbow.x - 0.5) * 10,
      -(elbow.y - 0.5) * 10,
      elbow.z * 10
    );
  }, [elbow]);

  const createArmModel = () => {
    if (!sceneRef.current) return;

    // Create arm group
    const armGroup = new THREE.Group();

    // Create forearm geometry
    const forearmGeometry = new THREE.CylinderGeometry(0.2, 0.15, 2, 32);
    const forearmMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5d0c5,
      shininess: 30
    });
    const forearm = new THREE.Mesh(forearmGeometry, forearmMaterial);
    forearm.rotation.x = Math.PI / 2;

    // Create hand geometry
    const handGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.2);
    const handMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xf5d0c5,
      shininess: 30
    });
    const hand = new THREE.Mesh(handGeometry, handMaterial);
    hand.position.y = -1.2;

    // Add meshes to group
    armGroup.add(forearm);
    armGroup.add(hand);

    // Store reference and add to scene
    armRef.current = armGroup;
    sceneRef.current.add(armGroup);
  };

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