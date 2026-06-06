'use client';

import React, { useEffect, useRef, useState } from 'react';

interface LiquidEtherProps {
  className?: string;
  colors?: string[];
  autoDemo?: boolean;
  autoSpeed?: number;
  autoIntensity?: number;
  autoResumeDelay?: number;
  autoRampDuration?: number;
}

/**
 * LiquidEther — Interactive fluid liquid background with morphing green blobs.
 * Only animates actively on hover (desktop) or touch (mobile).
 * Falls back to a subtle auto-demo when not interacting.
 * Uses CSS GPU-accelerated transforms for 60fps performance.
 */
export default function LiquidEther({
  className = '',
  colors = ['#16A34A', '#22C55E', '#BBF7D0'],
  autoDemo = true,
  autoSpeed = 0.15,
  autoIntensity = 0.6,
  autoResumeDelay = 5000,
  autoRampDuration = 1.5,
}: LiquidEtherProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const interactionTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    setMounted(true);
    return () => {
      if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
    };
  }, []);

  // Handle interaction start
  const handleInteractionStart = () => {
    setIsInteracting(true);
    setIsVisible(true);
    if (interactionTimerRef.current) clearTimeout(interactionTimerRef.current);
  };

  // Handle interaction end — resume auto-demo after delay
  const handleInteractionEnd = () => {
    interactionTimerRef.current = setTimeout(() => {
      setIsInteracting(false);
      if (autoDemo) {
        // Keep visible but ramp down intensity
      } else {
        setIsVisible(false);
      }
    }, autoResumeDelay);
  };

  // Generate blob seeds
  const [blobs] = useState(() =>
    Array.from({ length: 4 }, (_, i) => ({
      id: i,
      size: 250 + Math.random() * 350,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      color: colors[i % colors.length],
      driftX: (Math.random() - 0.5) * 40,
      driftY: (Math.random() - 0.5) * 40,
      duration: 12 + Math.random() * 10,
      delay: i * 2.5,
      blur: 70 + Math.random() * 60,
    }))
  );

  if (!mounted || prefersReducedMotion) return null;

  const demoOpacity = autoDemo ? (isInteracting ? 1 : autoIntensity * 0.6) : isVisible ? 1 : 0;
  const interactiveOpacity = isInteracting ? 1 : 0;
  const scaleFactor = isInteracting ? 1.15 : autoDemo ? 1 : 0.85;

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden select-none z-0 ${className}`}
      aria-hidden="true"
      onMouseEnter={handleInteractionStart}
      onMouseLeave={handleInteractionEnd}
      onTouchStart={handleInteractionStart}
      onTouchEnd={handleInteractionEnd}
    >
      {/* Transparent click-through layer for passive viewing when not interacting */}
      <div className="absolute inset-0 pointer-events-none" />
      {/* Morphing blobs */}
      {blobs.map((blob) => (
        <div
          key={blob.id}
          className="absolute rounded-full transition-all duration-300 ease-out"
          style={{
            width: blob.size,
            height: blob.size,
            left: `${blob.x}%`,
            top: `${blob.y}%`,
            backgroundColor: blob.color,
            filter: `blur(${blob.blur}px)`,
            opacity: demoOpacity * 0.25,
            willChange: 'transform, opacity',
            transform: `translate(-50%, -50%) scale(${scaleFactor})`,
            transition: `opacity ${autoRampDuration}s ease-out, transform ${autoRampDuration}s ease-out`,
            animation: isInteracting || autoDemo
              ? `liquidethern-${blob.id} ${blob.duration}s ease-in-out ${blob.delay}s infinite alternate`
              : 'none',
          }}
        />
      ))}

      {/* Interactive overlay pulse ring */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-out"
        style={{
          opacity: isInteracting ? 0.15 : 0,
          background: `radial-gradient(circle at 50% 50%, ${colors[0]}20, transparent 70%)`,
          transition: `opacity ${autoRampDuration}s ease-out`,
        }}
      />

      {/* Inject keyframes */}
      <style>{`
        ${blobs.map((blob) => `
          @keyframes liquidethern-${blob.id} {
            0% { transform: translate(-50%, -50%) translate(0, 0) scale(${scaleFactor * 0.9}); }
            25% { transform: translate(-50%, -50%) translate(${blob.driftX * 0.5}px, ${blob.driftY * 0.3}px) scale(${scaleFactor * 1.05}); }
            50% { transform: translate(-50%, -50%) translate(${blob.driftX * -0.3}px, ${blob.driftY * 0.7}px) scale(${scaleFactor * 0.95}); }
            75% { transform: translate(-50%, -50%) translate(${blob.driftX * 0.7}px, ${blob.driftY * -0.3}px) scale(${scaleFactor * 1.1}); }
            100% { transform: translate(-50%, -50%) translate(${blob.driftX * -0.5}px, ${blob.driftY * -0.5}px) scale(${scaleFactor * 0.85}); }
          }
        `).join('\n')}
      `}</style>
    </div>
  );
}
