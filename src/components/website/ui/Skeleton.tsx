// src/components/website/ui/Skeleton.tsx
import { cn } from '@/lib/utils';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'circle' | 'rect' | 'card';
}

export function Skeleton({ className, variant = 'rect' }: SkeletonProps) {
    return (
        <div
            className={cn(
                'animate-pulse bg-muted',
                {
                    'rounded-md': variant === 'text',
                    'rounded-full': variant === 'circle',
                    'rounded-xl': variant === 'rect',
                    'rounded-2xl': variant === 'card',
                },
                className
            )}
        />
    );
}