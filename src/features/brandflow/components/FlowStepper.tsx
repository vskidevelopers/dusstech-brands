'use client';

import { cn } from '@/lib/utils';

interface FlowStepperProps {
    currentStepIndex: number;
    totalSteps: number;
    className?: string;
}

export function FlowStepper({ currentStepIndex, totalSteps, className }: FlowStepperProps) {
    return (
        <div className={cn('flex items-center gap-1.5', className)} aria-label={`Step ${currentStepIndex} of ${totalSteps}`}>
            {Array.from({ length: Math.min(totalSteps, 6) }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        i < currentStepIndex
                            ? 'w-6 bg-primary'
                            : i === currentStepIndex
                                ? 'w-6 bg-primary/60'
                                : 'w-1.5 bg-muted-foreground/30'
                    )}
                    aria-hidden
                />
            ))}
        </div>
    );
}