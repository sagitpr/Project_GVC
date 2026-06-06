'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

interface GooeyNavItem {
  label: string;
  href: string;
}

interface GooeyNavProps {
  items: GooeyNavItem[];
  className?: string;
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
  onItemClick?: (item: GooeyNavItem, index: number) => void;
}

/**
 * GooeyNav — Animated navigation with gooey/particle effects.
 * Smooth tab-transition with SVG filter goo effect and particle bursts.
 * Mobile-friendly, reduced-motion compliant.
 */
export default function GooeyNav({
  items,
  className = '',
  animationTime = 600,
  particleCount = 12,
  particleDistances = [80, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
  onItemClick,
}: GooeyNavProps) {
  const navRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<SVGFilterElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    r: number;
    color: string;
    life: number;
    maxLife: number;
  }>>([]);
  const [mounted, setMounted] = useState(false);

  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  const PALETTE = [
    '#16A34A', // emerald
    '#22C55E', // green
    '#38bdf8', // sky
    '#8b5cf6', // violet
    '#f59e0b', // amber
    '#ec4899', // pink
    '#14b8a6', // teal
    '#f97316', // orange
  ];

  const spawnParticles = useCallback(
    (x: number, y: number, colorIdx: number) => {
      if (prefersReducedMotion) return;
      const newParticles = Array.from({ length: particleCount }, (_, i) => {
        const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
        const dist = particleDistances[0] + Math.random() * (particleDistances[1] - particleDistances[0]);
        const speed = 2 + Math.random() * 4;
        return {
          id: Date.now() + i,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          r: 2 + Math.random() * 3,
          color: PALETTE[colors[colorIdx % colors.length] % PALETTE.length],
          life: 0,
          maxLife: 30 + Math.random() * 20,
        };
      });
      setParticles((prev) => [...prev.slice(-40), ...newParticles]);
    },
    [particleCount, particleDistances, colors, prefersReducedMotion]
  );

  const handleClick = useCallback(
    (item: GooeyNavItem, index: number) => {
      setActiveIndex(index);
      onItemClick?.(item, index);

      // Spawn particles at the clicked nav item position
      if (navRef.current && !prefersReducedMotion) {
        const navItems = navRef.current.querySelectorAll('[data-nav-item]');
        const target = navItems[index] as HTMLElement;
        if (target) {
          const rect = target.getBoundingClientRect();
          const navRect = navRef.current.getBoundingClientRect();
          spawnParticles(
            rect.left - navRect.left + rect.width / 2,
            rect.top - navRect.top + rect.height / 2,
            index
          );
        }
      }
    },
    [onItemClick, spawnParticles, prefersReducedMotion]
  );

  // Animate particles
  useEffect(() => {
    if (particles.length === 0 || prefersReducedMotion) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.1,
            life: p.life + 1,
          }))
          .filter((p) => p.life < p.maxLife)
      );
    }, 50);
    return () => clearInterval(interval);
  }, [particles.length, prefersReducedMotion]);

  if (!mounted) {
    return (
      <nav className={`flex items-center gap-1 ${className}`}>
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href}
            className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              i === activeIndex
                ? 'text-white bg-emerald-600'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* SVG filter for gooey effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="gooey-nav-filter" ref={filterRef}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -8"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <nav
        ref={navRef}
        className="relative flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full p-1.5 border border-slate-200/60 dark:border-slate-700/60"
        style={prefersReducedMotion ? undefined : { filter: 'url(#gooey-nav-filter)' }}
      >
        {items.map((item, i) => {
          const isActive = i === activeIndex;
          return (
            <a
              key={i}
              data-nav-item
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item, i);
              }}
              className={`relative z-10 px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 select-none cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {item.label}
              {/* Active background pill */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-full bg-emerald-600 -z-10"
                  style={{
                    transition: `all ${animationTime * 0.6}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                  }}
                />
              )}
            </a>
          );
        })}

        {/* Particle layer */}
        {!prefersReducedMotion && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            {particles.map((p) => (
              <div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: p.x,
                  top: p.y,
                  width: p.r * 2,
                  height: p.r * 2,
                  backgroundColor: p.color,
                  opacity: 1 - p.life / p.maxLife,
                  transform: 'translate(-50%, -50%)',
                  transition: 'opacity 0.1s ease',
                }}
              />
            ))}
          </div>
        )}
      </nav>
    </div>
  );
}
