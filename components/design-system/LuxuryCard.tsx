'use client';

import React, { useRef, useState, useEffect } from 'react';
import { isReducedMotionPreferred } from '@/lib/design-system';

interface LuxuryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  enable3DTilt?: boolean;
  glowOnHover?: boolean;
}

export function LuxuryCard({
  children,
  className = '',
  enable3DTilt = true,
  glowOnHover = false,
  ...props
}: LuxuryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [canTilt, setCanTilt] = useState(() => {
    if (typeof window === 'undefined' || !enable3DTilt) return false;
    const isTouch = window.matchMedia('(hover: none)').matches;
    const reducedMotion = isReducedMotionPreferred();
    return !isTouch && !reducedMotion;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !enable3DTilt) return;
    const mq = window.matchMedia('(hover: none)');
    const onChange = () => {
      const isTouch = mq.matches;
      const reducedMotion = isReducedMotionPreferred();
      setCanTilt(!isTouch && !reducedMotion);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [enable3DTilt]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Maximum 2.5 degrees subtle rotation for quiet luxury
    const rotX = ((y - centerY) / centerY) * -2.5;
    const rotY = ((x - centerX) / centerX) * 2.5;
    setRotation({ x: rotX, y: rotY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: canTilt && isHovered
          ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateY(-2px)`
          : undefined,
        transition: isHovered
          ? 'transform 0.1s ease-out, box-shadow 0.25s ease, border-color 0.25s ease'
          : 'transform 0.4s ease-out, box-shadow 0.3s ease, border-color 0.3s ease',
      }}
      className={`glass-card relative overflow-hidden ${
        glowOnHover && isHovered ? 'shadow-[0_10px_30px_-5px_rgba(253,16,83,0.15)] border-[#FD1053]/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
