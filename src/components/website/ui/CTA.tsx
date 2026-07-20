import { cn } from '@/lib/utils';
import { Button } from './Button';

interface CTAProps {
    title: string;
    description?: string;
    primaryAction?: { label: string; href: string };
    secondaryAction?: { label: string; href: string };
    variant?: 'default' | 'gradient' | 'bordered';
    className?: string;
}

export function CTA({
    title,
    description,
    primaryAction,
    secondaryAction,
    variant = 'default',
    className,
}: CTAProps) {
    return (
        <div
            className={cn(
                'rounded-3xl p-8 md:p-12 lg:p-16 text-center',
                {
                    'bg-primary text-primary-foreground': variant === 'default',
                    'bg-gradient-to-br from-primary to-primary-700 text-primary-foreground': variant === 'gradient',
                    'bg-card border border-border': variant === 'bordered',
                },
                className
            )}
        >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{title}</h2>
            {description && (
                <p className={cn('max-w-2xl mx-auto mb-8 text-lg', variant === 'default' || variant === 'gradient' ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                    {description}
                </p>
            )}
            <div className="flex flex-wrap items-center justify-center gap-3">
                {primaryAction && (
                    <Button size="lg" variant={variant === 'bordered' ? 'default' : 'secondary'} asChild>
                        <a href={primaryAction.href}>{primaryAction.label}</a>
                    </Button>
                )}
                {secondaryAction && (
                    <Button size="lg" variant={variant === 'bordered' ? 'outline' : 'ghost'} className={cn(variant !== 'bordered' && 'text-primary-foreground hover:bg-primary-foreground/10')} asChild>
                        <a href={secondaryAction.href}>{secondaryAction.label}</a>
                    </Button>
                )}
            </div>
        </div>
    );
}