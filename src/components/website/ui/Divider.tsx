import { cn } from '@/lib/utils';

interface DividerProps {
    className?: string;
    variant?: 'solid' | 'dashed' | 'gradient';
}

export function Divider({ className, variant = 'solid' }: DividerProps) {
    return (
        <hr
            className={cn(
                'border-0',
                {
                    'border-t border-border': variant === 'solid',
                    'border-t border-dashed border-border': variant === 'dashed',
                    'h-px bg-gradient-to-r from-transparent via-border to-transparent': variant === 'gradient',
                },
                className
            )}
        />
    );
}