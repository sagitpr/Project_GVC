import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = {
  default: 'bg-eco-100 dark:bg-eco-900/50 text-eco-800 dark:text-eco-200',
  secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
  success: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200',
  warning: 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200',
  danger: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200',
  info: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-800 dark:text-cyan-200',
  outline: 'bg-transparent border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300',
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          badgeVariants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';
