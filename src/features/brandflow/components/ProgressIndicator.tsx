'use client';

import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
    progress: number;
    className?: string;
}

export function ProgressIndicator({ progress, className }: ProgressIndicatorProps) {
    return (
        <div className={cn('w-full', className)}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Progress
                </span>
                <span className="text-xs font-semibold text-foreground tabular-nums">
                    {progress}%
                </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                    className="h-full bg-gradient-to-r from-primary to-primary-400 transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                />
            </div>
        </div>
    );
}