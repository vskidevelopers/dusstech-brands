// src/components/website/ui/LoadingCard.tsx
import { cn } from '@/lib/utils';

export function LoadingCard({ className }: { className?: string }) {
    return (
        <div className={cn('rounded-2xl bg-card border border-border p-6', className)}>
            <div className="animate-pulse space-y-4">
                <div className="h-32 rounded-xl bg-muted" />
                <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-1/2 rounded bg-muted" />
                </div>
            </div>
        </div>
    );
}