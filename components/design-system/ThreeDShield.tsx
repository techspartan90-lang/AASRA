'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isReducedMotionPreferred } from '@/lib/design-system';

interface ThreeDShieldProps {
  className?: string;
  width?: number;
  height?: number;
}

export function ThreeDShield({ className = '', width, height }: ThreeDShieldProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch {
      return false;
    }
  });
  const [reducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return isReducedMotionPreferred();
  });

  useEffect(() => {
    if (!hasWebGL || reducedMotion || !mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 14;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);
    } catch (e) {
      setTimeout(() => setHasWebGL(false), 0);
      return;
    }

    // Soft lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xfd1053, 2.0, 30);
    pointLight.position.set(4, 5, 8);
    scene.add(pointLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(-6, 10, 8);
    scene.add(topLight);

    // Geometric Shield / Vault Polyhedron
    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // Outer Faceted Crystal Shield
    const icosahedronGeo = new THREE.IcosahedronGeometry(3.6, 1);
    const icosahedronMat = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      metalness: 0.3,
      roughness: 0.1,
      transmission: 0.8,
      transparent: true,
      opacity: 0.85,
      wireframe: false,
    });
    const shieldMesh = new THREE.Mesh(icosahedronGeo, icosahedronMat);
    shieldGroup.add(shieldMesh);

    // Inner Protective Core (#FD1053)
    const coreGeo = new THREE.OctahedronGeometry(1.8, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfd1053,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0xfd1053,
      emissiveIntensity: 0.3,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    shieldGroup.add(coreMesh);

    // Encrypted Wireframe Halo Ring
    const haloGeo = new THREE.TorusGeometry(4.8, 0.03, 16, 80);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2.5;
    shieldGroup.add(halo);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      shieldGroup.rotation.y += 0.005;
      shieldGroup.rotation.x += 0.002;
      coreMesh.rotation.y -= 0.01;
      coreMesh.rotation.z += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      icosahedronGeo.dispose();
      icosahedronMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
    };
  }, [hasWebGL, reducedMotion]);

  if (!hasWebGL || reducedMotion) {
    return (
      <div
        className={`flex items-center justify-center p-6 select-none ${className}`}
        style={{ minHeight: '260px' }}
      >
        <div className="relative w-40 h-40 rounded-full border border-[#FD1053]/40 bg-gradient-to-br from-[#333333] to-[#1E1E1E] flex items-center justify-center shadow-[0_0_30px_rgba(253,16,83,0.2)]">
          <div className="w-20 h-20 rounded-2xl rotate-45 border-2 border-white/20 bg-[#FD1053]/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-[#FD1053]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-[280px] sm:h-[320px] flex items-center justify-center overflow-hidden ${className}`}
    />
  );
}
