'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollStackCard {
  icon: React.ReactNode;
  title: string;
  content: string;
  color?: string;
}

interface ScrollStackProps {
  cards: ScrollStackCard[];
  className?: string;
  title?: string;
  subtitle?: string;
}

/**
 * ScrollStack — Sticky scroll storytelling section.
 * Cards stack and reveal one by one as the user scrolls.
 * Spring animations, subtle blur, fade, and scale transitions.
 * 60fps, mobile-friendly, no layout shift.
 */
export default function ScrollStack({
  cards,
  className = '',
  title = 'Cara Kerja SmartSort',
  subtitle = 'HOW IT WORKS',
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={containerRef}
      className={`relative py-24 md:py-32 px-6 ${className}`}
      aria-label={title}
    >
      {/* Section header */}
      <div className="max-w-6xl mx-auto mb-16 md:mb-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-[0.25em] text-emerald-600 dark:text-emerald-400 uppercase mb-4"
        >
          {subtitle}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-4xl font-light tracking-tight text-slate-900 dark:text-white"
        >
          {title}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-12 h-[2px] bg-emerald-500 mx-auto mt-6 origin-center"
        />
      </div>

      {/* Stacked cards */}
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        {cards.map((card, index) => (
          <StackCard
            key={index}
            card={card}
            index={index}
            total={cards.length}
            isInView={isInView}
          />
        ))}
      </div>
    </section>
  );
}

function StackCard({
  card,
  index,
  total,
  isInView,
}: {
  card: ScrollStackCard;
  index: number;
  total: number;
  isInView: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardInView = useInView(cardRef, { once: true, margin: '-80px' });

  // Number label
  const number = String(index + 1).padStart(2, '0');

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60, scale: 0.95, filter: 'blur(4px)' }}
      animate={
        isInView && cardInView
          ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
          : {}
      }
      transition={{
        type: 'spring',
        stiffness: 70,
        damping: 18,
        mass: 0.8,
        delay: index * 0.08,
      }}
      className="group relative"
    >
      <div className="relative bg-white dark:bg-slate-800/40 border border-gray-100 dark:border-gray-700/30 rounded-2xl p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover:border-emerald-100 dark:hover:border-emerald-800/30 hover:-translate-y-1">
        {/* Decorative number background */}
        <div
          className="absolute -top-3 -right-3 text-[80px] md:text-[120px] font-bold leading-none select-none pointer-events-none"
          style={{
            color: card.color
              ? `${card.color}08`
              : 'rgba(22, 163, 74, 0.04)',
          }}
          aria-hidden="true"
        >
          {number}
        </div>

        <div className="flex items-start gap-5">
          {/* Icon container */}
          <div
            className={`shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg ${
              card.color
                ? ''
                : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
            }`}
            style={
              card.color
                ? {
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                  }
                : undefined
            }
          >
            {card.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-bold tracking-wider text-emerald-500 dark:text-emerald-400">
                LANGKAH {index + 1}
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-200/60 to-transparent dark:from-emerald-800/30" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white mb-2">
              {card.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              {card.content}
            </p>
          </div>
        </div>

        {/* Progress line connecting cards */}
        {index < total - 1 && (
          <div className="hidden md:block absolute -bottom-4 left-7 w-px h-4 bg-gradient-to-b from-emerald-200 to-transparent dark:from-emerald-800/30" />
        )}
      </div>
    </motion.div>
  );
}
