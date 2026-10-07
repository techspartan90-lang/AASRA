'use client';

import React, { useEffect, useRef } from 'react';
import { isReducedMotionPreferred } from '@/lib/design-system';

interface ThreeDVoiceWaveProps {
  isListening?: boolean;
  isRecording?: boolean;
  isProcessing?: boolean;
  height?: number;
  className?: string;
}

export function ThreeDVoiceWave({
  isListening = false,
  isRecording = false,
  isProcessing = false,
  height,
  className = '',
}: ThreeDVoiceWaveProps) {
  const activeListening = isListening || isRecording;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let step = 0;
    const reducedMotion = isReducedMotionPreferred();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      if (reducedMotion) {
        // Static calm baseline line
        ctx.beginPath();
        ctx.strokeStyle = '#FD1053';
        ctx.lineWidth = 2;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        return;
      }

      step += activeListening ? 0.05 : isProcessing ? 0.08 : 0.02;

      const numWaves = 4;
      const baseAmp = activeListening ? 18 : isProcessing ? 12 : 5;

      for (let w = 0; w < numWaves; w++) {
        ctx.beginPath();
        const opacity = (1 - w * 0.22) * (activeListening ? 0.9 : 0.45);
        const color = w === 0 ? `rgba(253, 16, 83, ${opacity})` : `rgba(71, 71, 71, ${opacity * 0.7})`;
        ctx.strokeStyle = color;
        ctx.lineWidth = w === 0 ? 2.5 : 1.5;

        for (let x = 0; x < width; x += 3) {
          // Attenuation towards ends so it tapers off gracefully
          const distFromCenter = Math.abs(x - width / 2) / (width / 2);
          const envelope = Math.max(0, 1 - Math.pow(distFromCenter, 2));

          const freq = 0.015 + w * 0.005;
          const phase = step + w * 1.2;
          const y = centerY + Math.sin(x * freq + phase) * baseAmp * envelope;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
    };
  }, [activeListening, isProcessing]);

  return (
    <div className={`relative flex flex-col items-center justify-center w-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-24 sm:h-28"
      />
      <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#474747] dark:text-[#D6D6D6]">
        {activeListening ? (
          <>
            <span className="w-2 h-2 rounded-full bg-[#FD1053] animate-ping" />
            <span className="text-[#FD1053]">Listening... Speak naturally in your language</span>
          </>
        ) : isProcessing ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Processing your response...</span>
          </>
        ) : (
          <span>Trauma Voice ready. Voice analysis remains supplementary.</span>
        )}
      </div>
    </div>
  );
}
