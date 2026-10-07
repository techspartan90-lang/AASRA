'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { isReducedMotionPreferred } from '@/lib/design-system';

interface ThreeDHeroProps {
  className?: string;
  interactive?: boolean;
}

export function ThreeDHero({ className = '', interactive = true }: ThreeDHeroProps) {
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
    if (!hasWebGL || reducedMotion || !mountRef.current) {
      return;
    }

    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 18;

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

    // 2. Lighting Setup (Soft quiet luxury lighting with crimson accent)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(10, 15, 10);
    scene.add(keyLight);

    // Signature Crimson Accent Light (#FD1053)
    const crimsonLight = new THREE.PointLight(0xfd1053, 2.5, 40);
    crimsonLight.position.set(-6, -4, 8);
    scene.add(crimsonLight);

    // 3. Central Protective Sphere (Glassy Graphite & Soft Wireframe)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Core Sphere
    const innerGeometry = new THREE.SphereGeometry(3.6, 64, 64);
    const innerMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      metalness: 0.2,
      roughness: 0.15,
      transmission: 0.85, // Glassmorphic translucent refraction
      transparent: true,
      opacity: 0.88,
      ior: 1.45,
    });
    const innerSphere = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerSphere);

    // Inner Glowing Core (#FD1053)
    const glowGeometry = new THREE.SphereGeometry(2.2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xfd1053,
      transparent: true,
      opacity: 0.22,
    });
    const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
    coreGroup.add(glowSphere);

    // 4. Protective Orbiting Rings
    const ringGroup = new THREE.Group();
    coreGroup.add(ringGroup);

    // Outer Ring 1 (Graphite)
    const ring1Geo = new THREE.TorusGeometry(5.2, 0.05, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x474747,
      metalness: 0.6,
      roughness: 0.2,
      transparent: true,
      opacity: 0.65,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ringGroup.add(ring1);

    // Outer Ring 2 with Crimson Accent
    const ring2Geo = new THREE.TorusGeometry(6.4, 0.04, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xfd1053,
      metalness: 0.8,
      roughness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    ringGroup.add(ring2);

    // Outer Thin Orbit Ring
    const ring3Geo = new THREE.TorusGeometry(7.2, 0.02, 16, 100);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 3;
    ringGroup.add(ring3);

    // 5. Subtle Particle Cloud (#FD1053, #FFFFFF, #474747)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xfd1053);
    const c2 = new THREE.Color(0xffffff);
    const c3 = new THREE.Color(0x474747);

    for (let i = 0; i < particleCount; i++) {
      const radius = 6.5 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const chosenColor = i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // 6. Interactive Mouse Movement & Parallax
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 0.4;
      mouseY = (y / rect.height) * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Animation Loop (Slow rotation, vertical float 2-6px, soft heartbeat pulse)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle vertical floating (2-6px equivalent)
      coreGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.35;

      // Slow, luxurious rotation
      coreGroup.rotation.y += 0.003;
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.0025;
      particles.rotation.y -= 0.001;

      // Subtle Heartbeat pulse in inner core
      const pulseScale = 1 + Math.sin(elapsedTime * 1.6) * 0.05;
      glowSphere.scale.set(pulseScale, pulseScale, pulseScale);

      // Smooth mouse parallax lerp
      targetRotationY += (mouseX - targetRotationY) * 0.05;
      targetRotationX += (mouseY - targetRotationX) * 0.05;
      coreGroup.rotation.y += targetRotationY * 0.1;
      coreGroup.rotation.x = targetRotationX * 0.15;

      renderer.render(scene, camera);
    };

    animate();

    // 8. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [interactive, hasWebGL, reducedMotion]);

  // Graceful 2D Fallback for No WebGL or Reduced Motion
  if (!hasWebGL || reducedMotion) {
    return (
      <div
        className={`relative flex items-center justify-center select-none ${className}`}
        style={{ minHeight: '380px' }}
      >
        <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-[#333333] via-[#474747] to-[#1E1E1E] p-1 shadow-[0_0_50px_rgba(253,16,83,0.25)] border border-[#FD1053]/30 flex items-center justify-center">
          {/* Subtle Outer Concentric Ring */}
          <div className="absolute -inset-6 rounded-full border border-dashed border-[#FD1053]/30" />
          <div className="absolute -inset-12 rounded-full border border-[#474747]/20 dark:border-white/10" />

          {/* Glowing Center Core */}
          <div className="w-32 h-32 rounded-full bg-[#FD1053]/15 flex items-center justify-center border border-[#FD1053]/40 shadow-[0_0_30px_#FD1053]">
            <div className="w-16 h-16 rounded-full bg-[#FD1053]/30" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing ${className}`}
    />
  );
}
