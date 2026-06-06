'use client';

import React, { useRef, useCallback, useEffect, useState } from 'react';

interface BorderGlowProps {
  children: React.ReactNode;
  className?: string;
  /** Glow color in HSL format: "hue saturation lightness" */
  glowColor?: string;
  /** Background color (hex) */
  backgroundColor?: string;
  /** Border radius in px */
  borderRadius?: number;
  /** Glow radius in px */
  glowRadius?: number;
  /** Glow intensity 0-1 */
  glowIntensity?: number;
  /** Cone spread in degrees */
  coneSpread?: number;
  /** Whether to animate glow on hover */
  animated?: boolean;
  /** Gradient colors array for the glow */
  colors?: string[];
  /** Edge sensitivity (px) */
  edgeSensitivity?: number;
}

/**
 * BorderGlow — edge-sensitive glow container.
 * Glows near edges when hovered, with configurable colors and intensity.
 * Uses CSS transforms for 60fps performance.
 */
export default function BorderGlow({
  children,
  className = '',
  glowColor = '150 80 50',
  backgroundColor = '#0f172a',
  borderRadius = 16,
  glowRadius = 40,
  glowIntensity = 1,
  coneSpread = 25,
  animated = false,
  colors = ['#16A34A', '#22C55E', '#38bdf8'],
  edgeSensitivity = 30,
}: BorderGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({});
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate normalized position (0 to 1)
      const nx = x / rect.width;
      const ny = y / rect.height;

      // Calculate distance to nearest edge
      const distToLeft = x;
      const distToRight = rect.width - x;
      const distToTop = y;
      const distToBottom = rect.height - y;
      const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);

      // Normalize glow intensity based on proximity to edge
      const normalizedGlow = Math.max(0, 1 - minDist / edgeSensitivity);
      const intensity = normalizedGlow * glowIntensity;

      // Calculate gradient angle based on position
      const gradX = (nx - 0.5) * 2;
      const gradY = (ny - 0.5) * 2;
      const angle = Math.atan2(gradY, gradX) * (180 / Math.PI);

      // Build gradient colors with dynamic opacity
      const gradientColors = colors
        .map((c, i) => {
          const opacity = intensity * (1 - i * 0.15);
          return `rgba(from ${c} r g b / ${opacity})`;
        })
        .join(', ');

      setGlowStyle({
        background: `radial-gradient(circle at ${x}px ${y}px, ${colors[0]}${Math.round(intensity * 40).toString(16).padStart(2, '0')}, transparent ${glowRadius}px)`,
        opacity: intensity,
        transition: animated ? 'opacity 0.3s ease, background 0.3s ease' : 'opacity 0.1s ease',
      });
      setIsHovered(intensity > 0.1);
    },
    [edgeSensitivity, glowIntensity, glowRadius, colors, animated]
  );

  const handleMouseLeave = useCallback(() => {
    setGlowStyle({ opacity: 0, transition: 'opacity 0.5s ease' });
    setIsHovered(false);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ borderRadius }}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius, backgroundColor }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          ...glowStyle,
          borderRadius,
          willChange: 'opacity, background',
        }}
      />

      {/* Inner content */}
      <div className="relative z-20" style={{ borderRadius: borderRadius - 2 }}>
        {children}
      </div>

      {/* Decorative border ring */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{
          borderRadius,
          border: `1px solid ${isHovered ? colors[0] + '30' : 'rgba(255,255,255,0.06)'}`,
          transition: 'border-color 0.3s ease',
        }}
      />
    </div>
  );
}
