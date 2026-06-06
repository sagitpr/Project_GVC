import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

export const PageContainer = forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, narrow, children, ...props }, ref) => {
    return (
      <main
        ref={ref}
        className={cn(
          'min-h-[100dvh] pt-20 pb-24 md:pb-12',
          className
        )}
        {...props}
      >
        <div className={cn(
          'section-eco',
          narrow && 'max-w-3xl'
        )}>
          {children}
        </div>
      </main>
    );
  }
);

PageContainer.displayName = 'PageContainer';
