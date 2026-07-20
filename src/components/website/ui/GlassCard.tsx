import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: 'light' | 'medium' | 'heavy';
}

export function GlassCard({
    children,
    className,
    intensity = 'medium',
}: GlassCardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl border border-white/10 backdrop-blur-md',
                {
                    'bg-background/40': intensity === 'light',
                    'bg-background/60': intensity === 'medium',
                    'bg-background/80': intensity === 'heavy',
                },
                className
            )}
        >
            {children}
        </div>
    );
}