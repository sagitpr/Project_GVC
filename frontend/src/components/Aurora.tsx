'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AuroraProps {
  children?: React.ReactNode;
  className?: string;
  showRadial?: boolean;
  showGrid?: boolean;
}

/**
 * Aurora Component
 * Provides an animated eco-futuristic background wrapper with smooth 3D gradient blobs.
 * Completely optimized to use GPU-accelerated transforms and fully SSR-safe.
 */
export default function Aurora({ 
  children, 
  className = '', 
  showRadial = true,
  showGrid = true 
}: AuroraProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Elegant fallback during SSR to avoid hydration mismatch
    return (
      <div className={`relative w-full overflow-hidden bg-[#fafcfa] dark:bg-[#0b0f19] transition-colors duration-500 ${className}`}>
        {children}
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden bg-[#fafcfa] dark:bg-[#0b0f19] transition-colors duration-500 ${className}`}>
      {/* 1. Aurora Ambient Core Visual Blurs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        
        {/* Animated Blob 1: Environmental Eco Green */}
        <motion.div
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -40, 30, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-40 -left-20 w-[35rem] h-[35rem] rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 filter blur-[90px] mix-blend-screen dark:mix-blend-lighten"
        />

        {/* Animated Blob 2: Deep Eco Blue */}
        <motion.div
          animate={{
            x: [0, -50, 30, 0],
            y: [0, 30, -50, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/4 -right-20 w-[40rem] h-[40rem] rounded-full bg-blue-500/10 dark:bg-blue-500/5 filter blur-[110px] mix-blend-screen dark:mix-blend-lighten"
        />

        {/* Animated Blob 3: Futuristic AI Cyan */}
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, 50, -20, 0],
            scale: [1, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
          className="absolute -bottom-40 left-1/4 w-[38rem] h-[38rem] rounded-full bg-cyan-400/8 dark:bg-cyan-500/4 filter blur-[100px] mix-blend-screen dark:mix-blend-lighten"
        />

        {/* 2. Radial Gradient Overlay for depth mapping */}
        {showRadial && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(250,252,250,0.85)_80%)] dark:bg-[radial-gradient(circle_at_center,transparent_30%,rgba(11,15,25,0.9)_80%)]" />
        )}

        {/* 3. Subtle Environmental Grid Texture */}
        {showGrid && (
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.015)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        )}
      </div>

      {/* 4. Content children viewport */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
