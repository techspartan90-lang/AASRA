'use client';

import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

interface ThreeDShieldProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Luxury Static Cryptographic Shield Badge
 * Replaced heavy Three.js WebGL 3D animation with an accessible, high-performance vector emblem.
 */
export function ThreeDShield({ className = '', width, height }: ThreeDShieldProps) {
  const customDimensions = width && height ? { width, height } : {};

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={customDimensions}
      aria-label="Statutory Privacy and End-to-End Encryption Shield"
      role="img"
    >
      {/* Polished Concentric Vector Geometry */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
        {/* Outer Perimeter Ring */}
        <div className="absolute inset-0 rounded-full border border-dashed border-[#FD1053]/35" />
        <div className="absolute inset-2 rounded-full border border-white/10 dark:border-white/10" />

        {/* Inner Radial Glowing Shield Vessel */}
        <div
          className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full flex flex-col items-center justify-center shadow-2xl transition-transform duration-300 hover:scale-105"
          style={{
            background: 'radial-gradient(circle, rgba(253,16,83,0.18) 0%, rgba(30,30,30,0.95) 75%)',
            border: '2px solid rgba(253,16,83,0.45)',
            boxShadow: '0 0 35px rgba(253,16,83,0.22)',
          }}
        >
          {/* Central Luxury Protective Crest */}
          <div className="relative w-16 h-16 rounded-2xl bg-[#FD1053]/15 border border-[#FD1053] flex items-center justify-center shadow-lg">
            <ShieldCheck className="w-8 h-8 text-[#FD1053]" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#1E1E1E] border border-[#FD1053] flex items-center justify-center shadow-sm">
              <Lock className="w-2.5 h-2.5 text-white" />
            </div>
          </div>

          {/* Cryptographic Assurance Pill */}
          <span className="mt-2 text-[9px] font-extrabold uppercase tracking-widest text-[#D6D6D6] dark:text-[#A3A3A3]">
            Encrypted Vault
          </span>
        </div>
      </div>
    </div>
  );
}
