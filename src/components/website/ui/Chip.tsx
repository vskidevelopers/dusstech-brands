// src/components/website/ui/Chip.tsx
import { cn } from '@/lib/utils';

interface ChipProps {
    children: React.ReactNode;
    className?: string;
    active?: boolean;
    onClick?: () => void;
}

export function Chip({ children, className, active, onClick }: ChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-all',
                active
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground',
                onClick && 'cursor-pointer',
                className
            )}
        >
            {children}
        </button>
    );
}