'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { isReducedMotionPreferred } from '@/lib/design-system';
import { Shield, Heart, Activity, Users, PhoneCall, Sparkles, CheckCircle2, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type WellBeingState = 'balanced' | 'checkin' | 'attention' | 'support' | 'improving';

export interface StateConfig {
  id: WellBeingState;
  name: string;
  badge: string;
  statusLabel: string;
  description: string;
  guidance: string;
  pulseRate: number;
  particleSpeed: number;
  coreGlowColor: number; // Hex
  ringHighlightIndex: number;
  nodeIntensity: number;
}

export const WELL_BEING_STATES: Record<WellBeingState, StateConfig> = {
  balanced: {
    id: 'balanced',
    name: 'Balanced Baseline',
    badge: 'Equilibrium',
    statusLabel: 'Personal Well-Being Baseline',
    description: 'Personal emotional baseline is stable and calm. Support rings maintain peaceful equilibrium.',
    guidance: 'Continuous low-frequency calibration preserves emotional continuity without intrusion.',
    pulseRate: 0.7,
    particleSpeed: 0.008,
    coreGlowColor: 0xfd1053,
    ringHighlightIndex: 0,
    nodeIntensity: 0.4,
  },
  checkin: {
    id: 'checkin',
    name: 'Checking In',
    badge: 'Signal Ingest',
    statusLabel: 'Active Check-In Calibrating',
    description: 'Voluntary multi-channel check-in received. Micro-signals gently calibrate personal baseline.',
    guidance: 'All responses are end-to-end encrypted with zero raw voice retention post-analysis.',
    pulseRate: 1.1,
    particleSpeed: 0.018,
    coreGlowColor: 0xff3b75,
    ringHighlightIndex: 1,
    nodeIntensity: 0.7,
  },
  attention: {
    id: 'attention',
    name: 'Support Attention',
    badge: 'Proactive Alert',
    statusLabel: 'Support Attention Recommended',
    description: 'Subtle distress indicators observed against baseline. Caseworker support pathway alerted.',
    guidance: 'Non-punitive notification flagged for human casework review. AI assists; clinicians decide.',
    pulseRate: 1.5,
    particleSpeed: 0.024,
    coreGlowColor: 0xfd1053,
    ringHighlightIndex: 2,
    nodeIntensity: 0.9,
  },
  support: {
    id: 'support',
    name: 'Human Support Connected',
    badge: 'Connected Care',
    statusLabel: 'Welfare Counsellor Connected',
    description: 'Caseworker and trusted care circle actively engaged. Support channels are fully illuminated.',
    guidance: 'Empathetic human intervention initiated with voluntary protective escort protocols.',
    pulseRate: 0.9,
    particleSpeed: 0.012,
    coreGlowColor: 0x10b981,
    ringHighlightIndex: 2,
    nodeIntensity: 1.0,
  },
  improving: {
    id: 'improving',
    name: 'Well-Being Improving',
    badge: 'Recovery',
    statusLabel: 'Positive Recovery Trajectory',
    description: 'Signals show steady emotional recovery. The Well-Being Core radiates stabilized warmth.',
    guidance: 'Measurable score reduction over longitudinal observations reflects restorative healing.',
    pulseRate: 0.6,
    particleSpeed: 0.006,
    coreGlowColor: 0xff5a8a,
    ringHighlightIndex: 3,
    nodeIntensity: 0.6,
  },
};

interface ThreeDHeroProps {
  className?: string;
  interactive?: boolean;
  initialState?: WellBeingState;
}

export function ThreeDHero({
  className = '',
  interactive = true,
  initialState = 'balanced',
}: ThreeDHeroProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeState, setActiveState] = useState<WellBeingState>(initialState);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

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

  const activeConfig = useMemo(() => WELL_BEING_STATES[activeState], [activeState]);

  // Keep ref for Three.js render loop to access current state without recreating scene
  const stateRef = useRef<StateConfig>(activeConfig);
  useEffect(() => {
    stateRef.current = activeConfig;
  }, [activeConfig]);

  useEffect(() => {
    if (!hasWebGL || reducedMotion || !mountRef.current) {
      return;
    }

    const container = mountRef.current;
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 420;

    // =========================================================================
    // 1. SCENE, CAMERA, RENDERER
    // =========================================================================
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, 19);

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

    // =========================================================================
    // 2. LUXURY AMBIENT & DIRECTIONAL LIGHTING
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Warm high-contrast rim light
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(8, 12, 10);
    scene.add(keyLight);

    const backRimLight = new THREE.DirectionalLight(0x474747, 1.0);
    backRimLight.position.set(-10, -10, -8);
    scene.add(backRimLight);

    // Internal Well-Being Pulsing Point Light (Heart of the Core)
    const innerLight = new THREE.PointLight(0xfd1053, 3.2, 35);
    innerLight.position.set(0, 0, 0);
    scene.add(innerLight);

    // =========================================================================
    // 3. THE MANAS SURAKSHA WELL-BEING CORE
    //    3 Layered Envelopes:
    //    Layer A: Inner Personal Core (warm heartbeat pulse)
    //    Layer B: Middle Emotional Balance Layer (soft glowing organoid lattice)
    //    Layer C: Outer Protective Shield (frosted graphite/glassmorphism cocoon)
    // =========================================================================
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Layer A: Inner Core Sphere (Human Dignity & Hope)
    const innerCoreGeo = new THREE.SphereGeometry(1.9, 32, 32);
    const innerCoreMat = new THREE.MeshBasicMaterial({
      color: 0xfd1053,
      transparent: true,
      opacity: 0.65,
    });
    const innerCoreMesh = new THREE.Mesh(innerCoreGeo, innerCoreMat);
    coreGroup.add(innerCoreMesh);

    // Layer B: Middle Emotional Equilibrium Sphere (Soft Translucent Volume)
    const middleGeo = new THREE.IcosahedronGeometry(2.7, 4);
    const middleMat = new THREE.MeshPhysicalMaterial({
      color: 0x474747,
      metalness: 0.1,
      roughness: 0.25,
      transmission: 0.82,
      thickness: 1.5,
      transparent: true,
      opacity: 0.6,
      ior: 1.35,
    });
    const middleMesh = new THREE.Mesh(middleGeo, middleMat);
    coreGroup.add(middleMesh);

    // Layer C: Outer Protective Shell (Frosted Graphite Cocoon)
    // Subtle organic vertex displacement creates a living, breathing protective presence
    const outerGeo = new THREE.IcosahedronGeometry(3.5, 5);
    const outerMat = new THREE.MeshPhysicalMaterial({
      color: 0x333333,
      metalness: 0.2,
      roughness: 0.18,
      transmission: 0.88,
      thickness: 2.2,
      transparent: true,
      opacity: 0.72,
      ior: 1.48,
      reflectivity: 0.4,
      clearcoat: 0.3,
      clearcoatRoughness: 0.15,
    });
    const outerMesh = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerMesh);

    // Subtle Delicate Protective Wire Weave (Safety Net)
    const wireGeo = new THREE.IcosahedronGeometry(3.6, 2);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    coreGroup.add(wireMesh);

    // =========================================================================
    // 4. SUPPORT & WELL-BEING RINGS (4 Non-Planetary Translucent Rings)
    //    Ring 1: Personal Well-being (Balanced Foundation)
    //    Ring 2: Continuous Check-ins (Subtle Pulsing Signal)
    //    Ring 3: Human Support (Signature Connection Arc)
    //    Ring 4: Safety & Care (Wide Protective Wrap)
    // =========================================================================
    const ringsGroup = new THREE.Group();
    coreGroup.add(ringsGroup);

    // Ring 1: Personal Well-being
    const ring1Geo = new THREE.TorusGeometry(4.8, 0.035, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x474747,
      metalness: 0.4,
      roughness: 0.3,
      transparent: true,
      opacity: 0.7,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI * 0.35;
    ring1.rotation.y = Math.PI * 0.1;
    ringsGroup.add(ring1);

    // Ring 2: Continuous Check-ins
    const ring2Geo = new THREE.TorusGeometry(5.6, 0.025, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xfd1053,
      metalness: 0.7,
      roughness: 0.2,
      transparent: true,
      opacity: 0.65,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI * 0.28;
    ring2.rotation.y = -Math.PI * 0.18;
    ringsGroup.add(ring2);

    // Ring 3: Human Support (Caseworker & Connection Anchor)
    const ring3Geo = new THREE.TorusGeometry(6.4, 0.04, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.3,
      roughness: 0.2,
      transparent: true,
      opacity: 0.5,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.x = Math.PI * 0.15;
    ring3.rotation.z = Math.PI * 0.4;
    ringsGroup.add(ring3);

    // Ring 4: Safety & Care (Outer Protective Arc)
    const ring4Geo = new THREE.TorusGeometry(7.2, 0.02, 16, 120);
    const ring4Mat = new THREE.MeshBasicMaterial({
      color: 0x474747,
      transparent: true,
      opacity: 0.35,
    });
    const ring4 = new THREE.Mesh(ring4Geo, ring4Mat);
    ring4.rotation.y = Math.PI * 0.45;
    ring4.rotation.x = -Math.PI * 0.1;
    ringsGroup.add(ring4);

    // =========================================================================
    // 5. SUPPORT NODES & CONNECTION RAYS
    //    5 Abstract glowing nodes: Counsellor, Check-In, Care Circle, Helpline, Well-Being
    //    Thin glowing connection lines link them directly to the Core
    // =========================================================================
    const nodesGroup = new THREE.Group();
    coreGroup.add(nodesGroup);

    const supportNodesData = [
      { name: 'Counsellor', angle: 0.3, radius: 6.2, y: 1.8, color: 0xfd1053 },
      { name: 'Check-In', angle: 1.8, radius: 5.8, y: -2.0, color: 0xffffff },
      { name: 'Care Circle', angle: 3.2, radius: 6.5, y: 0.5, color: 0xfd1053 },
      { name: 'Helpline', angle: 4.6, radius: 6.0, y: -1.2, color: 0x474747 },
      { name: 'Well-being', angle: 5.7, radius: 6.3, y: 2.2, color: 0xffffff },
    ];

    const nodeMeshes: THREE.Mesh[] = [];
    const lineMeshes: THREE.Line[] = [];

    supportNodesData.forEach(node => {
      const x = Math.cos(node.angle) * node.radius;
      const z = Math.sin(node.angle) * node.radius;
      const y = node.y;

      // Small glowing node beacon
      const nodeGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const nodeMat = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.85,
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      nodesGroup.add(nodeMesh);
      nodeMeshes.push(nodeMesh);

      // Delicate connection beam linking node to outer edge of Core
      const points = [
        new THREE.Vector3(x * 0.58, y * 0.58, z * 0.58),
        new THREE.Vector3(x, y, z),
      ];
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.25,
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      nodesGroup.add(lineMesh);
      lineMeshes.push(lineMesh);
    });

    // =========================================================================
    // 6. EMOTIONAL WELL-BEING PARTICLES (Gentle Inward Stream)
    //    Micro-particles representing incoming voluntary signals and support flow
    // =========================================================================
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleAngles = new Float32Array(particleCount);
    const particleY = new Float32Array(particleCount);
    const particleColors = new Float32Array(particleCount * 3);

    const cPink = new THREE.Color(0xfd1053);
    const cWhite = new THREE.Color(0xffffff);
    const cGraphite = new THREE.Color(0x474747);

    for (let i = 0; i < particleCount; i++) {
      particleRadii[i] = 4.2 + Math.random() * 5.0;
      particleAngles[i] = Math.random() * Math.PI * 2;
      particleY[i] = (Math.random() - 0.5) * 6.5;
      particleSpeeds[i] = 0.006 + Math.random() * 0.012;

      particlePositions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
      particlePositions[i * 3 + 1] = particleY[i];
      particlePositions[i * 3 + 2] = Math.sin(particleAngles[i]) * particleRadii[i];

      const chosenColor = i % 4 === 0 ? cPink : i % 4 === 1 ? cWhite : cGraphite;
      particleColors[i * 3] = chosenColor.r;
      particleColors[i * 3 + 1] = chosenColor.g;
      particleColors[i * 3 + 2] = chosenColor.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.14,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // =========================================================================
    // 7. INTERACTIVE MOUSE PARALLAX (Subtle 3-8px response)
    // =========================================================================
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 0.35;
      mouseY = (y / rect.height) * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // =========================================================================
    // 8. ANIMATION LOOP WITH BREATHING HEARTBEAT & DYNAMIC STATE TRANSITION
    // =========================================================================
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const cfg = stateRef.current;

      // Soft natural breathing pulse (12-16 breaths/min equivalent)
      const breathingPulse = Math.sin(elapsedTime * cfg.pulseRate * 1.8);
      const innerScale = 1 + breathingPulse * 0.08;
      innerCoreMesh.scale.set(innerScale, innerScale, innerScale);

      // Middle equilibrium volume breathes in subtle counter-phase
      const middleScale = 1 + Math.sin(elapsedTime * cfg.pulseRate * 1.2 + 0.6) * 0.03;
      middleMesh.scale.set(middleScale, middleScale, middleScale);

      // Outer protective shell maintains gentle hovering
      coreGroup.position.y = Math.sin(elapsedTime * 0.7) * 0.32;

      // Dynamic inner light intensity linked to breathing
      innerLight.intensity = 2.4 + breathingPulse * 1.1;
      innerLight.color.setHex(cfg.coreGlowColor);
      innerCoreMat.color.setHex(cfg.coreGlowColor);

      // Ring rotations (independent, calm, serene)
      coreGroup.rotation.y += 0.0025;
      ring1.rotation.z += 0.002;
      ring2.rotation.z -= 0.0028;
      ring3.rotation.y += 0.0018;
      ring4.rotation.x -= 0.0015;

      // Highlight corresponding ring for the active state
      ring1Mat.opacity = cfg.ringHighlightIndex === 0 ? 0.85 : 0.45;
      ring2Mat.opacity = cfg.ringHighlightIndex === 1 ? 0.9 : 0.45;
      ring3Mat.opacity = cfg.ringHighlightIndex === 2 ? 0.95 : 0.4;
      ring4Mat.opacity = cfg.ringHighlightIndex === 3 ? 0.85 : 0.35;

      // Inward micro-particle flow (signals gently converging on the Core)
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        // Drift inward
        particleRadii[i] -= cfg.particleSpeed;
        if (particleRadii[i] < 3.6) {
          // Reset to outer boundary once it enters the core
          particleRadii[i] = 8.5 + Math.random() * 1.5;
          particleAngles[i] = Math.random() * Math.PI * 2;
          particleY[i] = (Math.random() - 0.5) * 6.5;
        }

        particleAngles[i] += 0.002;
        positions[i * 3] = Math.cos(particleAngles[i]) * particleRadii[i];
        positions[i * 3 + 1] = particleY[i] + Math.sin(elapsedTime + i) * 0.08;
        positions[i * 3 + 2] = Math.sin(particleAngles[i]) * particleRadii[i];
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Subtle beacon glow on support nodes
      nodeMeshes.forEach((mesh, index) => {
        const beaconPulse = Math.sin(elapsedTime * 2.2 + index) * 0.25;
        (mesh.material as THREE.MeshBasicMaterial).opacity = Math.min(
          1.0,
          cfg.nodeIntensity * 0.75 + beaconPulse
        );
      });

      // Mouse Parallax Lerp (delicate 3-8px equivalent response)
      targetRotationY += (mouseX - targetRotationY) * 0.05;
      targetRotationX += (mouseY - targetRotationX) * 0.05;
      coreGroup.rotation.y += targetRotationY * 0.08;
      coreGroup.rotation.x = targetRotationX * 0.12;

      renderer.render(scene, camera);
    };

    animate();

    // =========================================================================
    // 9. RESIZE HANDLER
    // =========================================================================
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // =========================================================================
    // 10. CLEANUP DISPOSAL
    // =========================================================================
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
      innerCoreGeo.dispose();
      innerCoreMat.dispose();
      middleGeo.dispose();
      middleMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      ring4Geo.dispose();
      ring4Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, [hasWebGL, reducedMotion, interactive]);

  // Graceful 2D Fallback for Reduced Motion or No WebGL
  if (!hasWebGL || reducedMotion) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-6 select-none ${className}`}
        style={{ minHeight: '380px' }}
      >
        <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-[#1E1E1E] via-[#333333] to-[#151515] p-1 shadow-[0_0_50px_rgba(253,16,83,0.22)] border border-[#FD1053]/35 flex items-center justify-center">
          {/* Subtle Outer Concentric Ring */}
          <div className="absolute -inset-5 rounded-full border border-dashed border-[#FD1053]/30" />
          <div className="absolute -inset-10 rounded-full border border-white/10" />

          {/* Glowing Inner Well-Being Core */}
          <div className="w-36 h-36 rounded-full bg-[#FD1053]/15 flex items-center justify-center border border-[#FD1053]/45 shadow-[0_0_35px_rgba(253,16,83,0.35)]">
            <div className="w-16 h-16 rounded-full bg-[#FD1053]/35 flex items-center justify-center">
              <Heart className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>

        {/* Accessible Static Explanation */}
        <div className="mt-6 text-center max-w-xs space-y-1">
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            MANAS SURAKSHA Well-Being Core
          </div>
          <p className="text-[11px] text-[#A3A3A3] leading-relaxed">
            Personal well-being calibrated with continuous support rings. Static view enabled per motion preferences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[380px] sm:min-h-[440px] flex flex-col items-center justify-center overflow-hidden ${className}`}>
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        onClick={() => setShowInfoModal(true)}
        title="Click to explore the Well-Being Core animation states"
        className="relative w-full h-full flex-1 flex items-center justify-center cursor-pointer"
      />

      {/* Floating State Indicator & Interactive Selector HUD */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto z-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInfoModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 text-xs text-white transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#FD1053] animate-pulse" />
            <span className="font-semibold text-[11px] tracking-wide">{activeConfig.name}</span>
            <Info className="w-3 h-3 text-[#A3A3A3] ml-0.5" />
          </button>
        </div>

        <span className="text-[10px] font-bold tracking-widest text-[#A3A3A3] uppercase bg-black/50 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">
          {activeConfig.badge}
        </span>
      </div>

      {/* Bottom Interactive State Switcher Pills */}
      <div className="absolute bottom-3 left-2 right-2 flex items-center justify-center gap-1 pointer-events-auto z-10 flex-wrap">
        {(Object.keys(WELL_BEING_STATES) as WellBeingState[]).map(stateKey => {
          const cfg = WELL_BEING_STATES[stateKey];
          const isSelected = activeState === stateKey;
          return (
            <button
              key={stateKey}
              type="button"
              onClick={e => {
                e.stopPropagation();
                setActiveState(stateKey);
              }}
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition cursor-pointer border ${
                isSelected
                  ? 'bg-[#FD1053] text-white border-[#FD1053] shadow-md shadow-[#FD1053]/30'
                  : 'bg-black/50 text-[#D6D6D6] hover:text-white border-white/10 hover:border-white/20 backdrop-blur-md'
              }`}
            >
              {cfg.name.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Modal: Well-Being Core Architectural Explanation */}
      <AnimatePresence>
        {showInfoModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setShowInfoModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md p-6 rounded-3xl bg-[#1E1E1E] border border-white/15 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-t border-[rgba(255,255,255,0.08)]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#FD1053]/20 border border-[#FD1053]/40 flex items-center justify-center text-[#FD1053]">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">The Well-Being Core</h3>
                    <p className="text-[11px] text-[#A3A3A3]">MANAS SURAKSHA Human-Centered 3D Model</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-[#A3A3A3] hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Active State Card */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FD1053]">{activeConfig.statusLabel}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3A3A3] bg-black/40 px-2 py-0.5 rounded-md">
                    {activeConfig.badge}
                  </span>
                </div>
                <p className="text-xs text-[#D6D6D6] leading-relaxed">{activeConfig.description}</p>
                <div className="pt-2 text-[11px] text-[#888888] border-t border-white/5 flex items-start gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-[#FD1053] shrink-0 mt-0.5" />
                  <span>{activeConfig.guidance}</span>
                </div>
              </div>

              {/* Anatomy of the Well-Being Core */}
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-white text-[11px] uppercase tracking-wider text-[#A3A3A3]">
                  Anatomy of the Visual
                </h4>
                <div className="space-y-1.5 text-[11px] text-[#D6D6D6]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#FD1053]" />
                    <span><strong>Inner Core:</strong> Represents individual dignity, hope, and personal baseline rhythm.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#474747]" />
                    <span><strong>Frosted Outer Shell:</strong> Represents psychological safety and trauma-informed protection.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white/70" />
                    <span><strong>Support Rings:</strong> Represent continuous check-ins, caseworker engagement, and care circles.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span><strong>Micro-Particles:</strong> Voluntary check-in signals converging safely toward the Core.</span>
                  </div>
                </div>
              </div>

              {/* Ethical AI Guarantee */}
              <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-[#888888] space-y-1">
                <span className="font-semibold text-white block">Ethical Principle:</span>
                <p>
                  Monitoring ≠ Surveillance. AI assists; humans decide. Predictions are non-diagnostic indicators designed solely to connect citizens with qualified support caseworkers.
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowInfoModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#FD1053] text-white text-xs font-semibold hover:bg-[#fd1053]/90 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
