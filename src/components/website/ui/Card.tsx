import { cn } from '@/lib/utils';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'elevated' | 'bordered' | 'flat';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
}

export function Card({
    children,
    className,
    variant = 'default',
    padding = 'lg',
    hover = false,
}: CardProps) {
    return (
        <div
            className={cn(
                'rounded-2xl transition-all duration-200',
                {
                    'bg-card text-card-foreground shadow-sm': variant === 'default',
                    'bg-card text-card-foreground shadow-md': variant === 'elevated',
                    'bg-card text-card-foreground border border-border': variant === 'bordered',
                    'bg-muted/30 text-foreground': variant === 'flat',
                    'p-4': padding === 'sm',
                    'p-6': padding === 'md',
                    'p-8': padding === 'lg',
                    'hover:shadow-lg hover:-translate-y-0.5 cursor-pointer': hover,
                },
                className
            )}
        >
            {children}
        </div>
    );
}