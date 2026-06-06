'use client';

import React from 'react';

interface GlassIconItem {
  icon: React.ReactNode;
  color: keyof typeof gradientMapping | string;
  label: string;
  description?: string;
  href?: string;
  customClass?: string;
}

interface GlassIconsProps {
  items: GlassIconItem[];
  className?: string;
  colorful?: boolean;
  columns?: 3 | 4 | 6;
  variant?: 'default' | 'compact' | 'expanded';
}

const gradientMapping = {
  blue: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
  purple: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
  red: 'linear-gradient(135deg, #ef4444, #dc2626)',
  indigo: 'linear-gradient(135deg, #6366f1, #4338ca)',
  orange: 'linear-gradient(135deg, #f59e0b, #d97706)',
  green: 'linear-gradient(135deg, #16a34a, #15803d)',
  emerald: 'linear-gradient(135deg, #10b981, #059669)',
  teal: 'linear-gradient(135deg, #14b8a6, #0d9488)',
  sky: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
  pink: 'linear-gradient(135deg, #ec4899, #db2777)',
  violet: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  amber: 'linear-gradient(135deg, #f59e0b, #d97706)',
  cyan: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  rose: 'linear-gradient(135deg, #f43f5e, #e11d48)',
};

/**
 * GlassIcons — Grid of frosted-glass icon buttons representing ecosystem features.
 * Each item gets a gradient background, glass overlay, and label.
 */
export default function GlassIcons({
  items,
  className = '',
  colorful = true,
  columns = 3,
  variant = 'default',
}: GlassIconsProps) {
  const gridCols = {
    3: 'grid-cols-1 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-6',
  };

  const getBackgroundStyle = (color: keyof typeof gradientMapping | string) => {
    if (colorful && gradientMapping[color as keyof typeof gradientMapping]) {
      return { background: gradientMapping[color as keyof typeof gradientMapping] };
    }
    return { background: color };
  };

  const getSizeClass = () => {
    switch (variant) {
      case 'compact':
        return 'p-3 gap-2';
      case 'expanded':
        return 'p-8 gap-4';
      default:
        return 'p-5 gap-3';
    }
  };

  const getIconSize = () => {
    switch (variant) {
      case 'compact': return 'w-10 h-10';
      case 'expanded': return 'w-16 h-16';
      default: return 'w-12 h-12';
    }
  };

  const getFontSize = () => {
    switch (variant) {
      case 'compact': return 'text-[10px]';
      default: return 'text-xs';
    }
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-4 ${className}`}>
      {items.map((item, index) => (
        <a
          key={index}
          href={item.href || '#'}
          className={`group relative flex flex-col items-center text-center ${getSizeClass()} rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-[0.98] ${item.customClass || ''}`}
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Glass background layer */}
          <div
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-all duration-500"
            style={{
              ...getBackgroundStyle(item.color),
              borderRadius: 'inherit',
            }}
          />

          {/* Inner glass highlight */}
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          />

          {/* Icon */}
          <span
            className={`relative z-10 ${getIconSize()} rounded-xl flex items-center justify-center text-lg text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}
            style={colorful ? getBackgroundStyle(item.color) : undefined}
          >
            {item.icon}
          </span>

          {/* Label */}
          <span
            className={`relative z-10 ${getFontSize()} font-semibold text-slate-800 dark:text-slate-100 mt-2 transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400`}
          >
            {item.label}
          </span>

          {/* Description */}
          {item.description && variant === 'expanded' && (
            <span className="relative z-10 text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {item.description}
            </span>
          )}

          {/* Shimmer on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        </a>
      ))}
    </div>
  );
}

export { gradientMapping };
export type { GlassIconItem };
