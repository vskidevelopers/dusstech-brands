import { cn } from '@/lib/utils';

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'muted' | 'canvas' | 'gradient';
    id?: string;
}

export function Section({
    children,
    className,
    variant = 'default',
    id,
}: SectionProps) {
    return (
        <section
            id={id}
            className={cn(
                'py-16 md:py-24 lg:py-32',
                {
                    'bg-background': variant === 'default',
                    'bg-muted/30': variant === 'muted',
                    'bg-canvas': variant === 'canvas',
                    'bg-gradient-to-b from-canvas to-background': variant === 'gradient',
                },
                className
            )}
        >
            {children}
        </section>
    );
}