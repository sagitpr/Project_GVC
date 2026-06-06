'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface AnimatedListItem {
  icon: React.ReactNode;
  title: string;
  description?: string;
  metadata?: string | number;
  color?: string;
  badge?: string;
}

interface AnimatedListProps {
  items: AnimatedListItem[];
  variant?: 'default' | 'activity' | 'result';
  className?: string;
  emptyMessage?: string;
  title?: string;
  subtitle?: string;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 100,
      damping: 22,
      mass: 0.8,
    },
  },
};

const activityDotVariants = {
  idle: { scale: 1, opacity: 0.4 },
  active: {
    scale: [1, 1.3, 1],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const resultBarVariants = {
  hidden: { width: 0 },
  visible: (value: number) => ({
    width: `${Math.min(Math.max(value, 0), 100)}%`,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: 'easeOut' as const,
    },
  }),
};

export default function AnimatedList({
  items,
  variant = 'default',
  className = '',
  emptyMessage = 'Belum ada data.',
  title,
  subtitle,
}: AnimatedListProps) {
  const prefersReducedMotion = useReducedMotion();
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500 dark:text-slate-400">
        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 11.625l2.25-2.25M12 11.625l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <p className="text-sm font-light">{emptyMessage}</p>
      </div>
    );
  }

  const cardStyle = getCardBaseStyle(variant);

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="text-center mb-10">
          {subtitle && (
            <p className="text-xs font-semibold tracking-[0.25em] text-emerald-600 dark:text-emerald-400 uppercase mb-3">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-slate-900 dark:text-white">
              {title}
            </h2>
          )}
        </div>
      )}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        className={`space-y-3 ${variant === 'activity' ? 'max-w-2xl mx-auto' : ''}`}
        role="list"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={cardStyle}
            role="listitem"
            tabIndex={0}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.01, transition: { type: 'spring' as const, stiffness: 300, damping: 20 } }}
          >
            {/* Variant: Activity — horizontal timeline style */}
            {variant === 'activity' ? (
              <div className="flex items-start gap-4">
                <div className="relative flex flex-col items-center shrink-0">
                  <motion.div
                    variants={activityDotVariants}
                    initial="idle"
                    animate={index === 0 ? 'active' : 'idle'}
                    className={`w-2.5 h-2.5 rounded-full ${
                      index === 0
                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(22,163,74,0.4)]'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  />
                  {index < items.length - 1 && (
                    <div className="w-px h-full min-h-[2rem] bg-slate-100 dark:bg-slate-700 mt-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </span>
                    {item.badge && (
                      <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                  {item.metadata && (
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1 block">
                      {item.metadata}
                    </span>
                  )}
                </div>
              </div>
            ) : /* Variant: Result — card with progress bar */ variant === 'result' ? (
              <div className="space-y-2">
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    item.color || 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      {item.metadata !== undefined && (
                        <span className="shrink-0 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                          {typeof item.metadata === 'number' ? `${item.metadata}%` : item.metadata}
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                {/* Progress bar */}
                {typeof item.metadata === 'number' && (
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      custom={item.metadata}
                      variants={resultBarVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className={`h-full rounded-full ${
                        item.metadata >= 80
                          ? 'bg-emerald-500'
                          : item.metadata >= 50
                          ? 'bg-amber-500'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                )}
              </div>
            ) : (
              /* Variant: Default — card style for landing page features */
              <div className="flex items-center gap-4">
                <div className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${
                  item.color || 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>
                <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function getCardBaseStyle(variant: string): string {
  const base =
    'rounded-xl border transition-all duration-300 motion-reduce:transition-none motion-reduce:transform-none';

  switch (variant) {
    case 'activity':
      return `${base} bg-transparent border-0 p-0`;
    case 'result':
      return `${base} bg-gradient-to-br from-emerald-50/80 via-white to-white dark:from-emerald-950/20 dark:via-slate-800/30 dark:to-slate-800/30 border-emerald-100/60 dark:border-emerald-900/20 p-4 hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-800/40`;
    default:
      return `${base}      bg-white/80 dark:bg-slate-800/40 border-slate-100 dark:border-slate-700/30 p-4 hover:shadow-lg hover:border-emerald-100 dark:hover:border-emerald-800/30 hover:-translate-y-0.5 cursor-default`;
  }
}
