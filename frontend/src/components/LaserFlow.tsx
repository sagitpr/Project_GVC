'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface LaserFlowProps {
  className?: string;
  flowSpeed?: number;
  flowStrength?: number;
  lineCount?: number;
}

/**
 * LaserFlow — Animated flowing data lines representing AI/OCR/classification pipeline.
 * GPU-accelerated via CSS transforms. Auto-disables on low FPS or reduced motion.
 * Green palette: #16A34A (primary), #22C55E (secondary), #86EFAC (accent).
 */
export default function LaserFlow({
  className = '',
  flowSpeed = 0.2,
  flowStrength = 0.15,
  lineCount = 8,
}: LaserFlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [fpsOk, setFpsOk] = useState(true);
  const fpsRef = useRef<number[]>([]);
  const rafRef = useRef<number>(0);
  const lastFrameRef = useRef<number>(performance.now());

  // Check reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // FPS monitor — disable if below 45, then stop checking
  const checkFps = useCallback(() => {
    const now = performance.now();
    const delta = now - lastFrameRef.current;
    lastFrameRef.current = now;

    fpsRef.current.push(1000 / delta);

    if (fpsRef.current.length >= 30) {
      const avg = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;
      if (avg < 45) {
        setFpsOk(false);
      }
      // Stop monitoring after we have enough samples
      return;
    }

    rafRef.current = requestAnimationFrame(checkFps);
  }, []);

  useEffect(() => {
    setMounted(true);

    if (!prefersReducedMotion) {
      rafRef.current = requestAnimationFrame(checkFps);
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [checkFps, prefersReducedMotion]);

  // Generate random line seeds once on mount
  const [lines] = useState(() =>
    Array.from({ length: lineCount }, (_, i) => ({
      id: i,
      top: 10 + (i * 80) / lineCount + Math.random() * 5,
      delay: i * 1.2,
      duration: 8 + Math.random() * 4 + (1 - flowSpeed) * 10,
      width: 20 + Math.random() * 60,
      opacity: 0.15 + Math.random() * 0.2 + flowStrength * 0.5,
      direction: i % 2 === 0 ? 1 : -1,
    }))
  );

  if (!mounted || fpsOk === false || prefersReducedMotion) {
    return null;
  }

  // Clamp values
  const safeSpeed = Math.min(Math.max(flowSpeed, 0.05), 0.5);
  const safeStrength = Math.min(Math.max(flowStrength, 0.05), 0.5);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none z-[1] ${className}`}
      aria-hidden="true"
    >
      {/* Flowing gradient lines */}
      {lines.map((line) => (
        <div
          key={line.id}
          className="absolute h-px"
          style={{
            top: `${line.top}%`,
            left: line.direction === 1 ? '-20%' : 'auto',
            right: line.direction === -1 ? '-20%' : 'auto',
            width: `${line.width}%`,
            opacity: line.opacity,
            willChange: 'transform',
            transform: `translateX(${line.direction === 1 ? '-100%' : '100%'})`,
            animation: `laserflow-${line.direction === 1 ? 'right' : 'left'} ${line.duration}s linear ${line.delay}s infinite`,
            background: `linear-gradient(${line.direction === 1 ? 'to right' : 'to left'},
              transparent 0%,
              rgba(22, 163, 74, 0.6) 20%,
              rgba(34, 197, 94, 0.8) 40%,
              rgba(134, 239, 172, 0.9) 50%,
              rgba(34, 197, 94, 0.8) 60%,
              rgba(22, 163, 74, 0.6) 80%,
              transparent 100%
            )`,
            boxShadow: `0 0 ${4 + safeStrength * 20}px rgba(22, 163, 74, ${0.2 + safeStrength * 0.3}), 0 0 ${8 + safeStrength * 30}px rgba(34, 197, 94, ${0.1 + safeStrength * 0.2})`,
            animationDuration: `${Math.max(line.duration * (1 - safeSpeed * 0.6), 3)}s`,
          }}
        />
      ))}

      {/* Secondary slower wider glow beams */}
      {lines.slice(0, 4).map((line) => (
        <div
          key={`glow-${line.id}`}
          className="absolute"
          style={{
            top: `${line.top + 2}%`,
            left: line.direction === 1 ? '-30%' : 'auto',
            right: line.direction === -1 ? '-30%' : 'auto',
            width: `${line.width * 1.5}%`,
            height: '12px',
            opacity: line.opacity * 0.3,
            willChange: 'transform',
            transform: `translateX(${line.direction === 1 ? '-100%' : '100%'})`,
            animation: `laserflow-${line.direction === 1 ? 'right' : 'left'} ${line.duration * 2.5}s linear ${line.delay * 0.7}s infinite`,
            background: `linear-gradient(${line.direction === 1 ? 'to right' : 'to left'},
              transparent 0%,
              rgba(22, 163, 74, 0.08) 30%,
              rgba(134, 239, 172, 0.15) 50%,
              rgba(22, 163, 74, 0.08) 70%,
              transparent 100%
            )`,
            filter: 'blur(6px)',
          }}
        />
      ))}

      {/* Inject keyframes */}
      <style>{`
        @keyframes laserflow-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(calc(100vw + 100%)); }
        }
        @keyframes laserflow-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(calc(-100vw - 100%)); }
        }
      `}</style>
    </div>
  );
}
