import { cn } from '@/lib/utils';
import { typography } from '@/design/typography';

interface HeadingProps {
    children: React.ReactNode;
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    level?: 'display' | 'h1' | 'h2' | 'h3' | 'h4';
    tracking?: 'tight' | 'normal' | 'wide';
    align?: 'left' | 'center' | 'right';
}

const levelStyles = {
    display: 'text-[clamp(3rem,6vw,5.5rem)] font-bold leading-[1.05] tracking-[-0.03em]',
    h1: 'text-[clamp(2.25rem,4vw,3.75rem)] font-bold leading-[1.1] tracking-[-0.025em]',
    h2: 'text-[clamp(1.875rem,3vw,3rem)] font-semibold leading-[1.15] tracking-[-0.02em]',
    h3: 'text-[clamp(1.5rem,2.25vw,2.25rem)] font-semibold leading-[1.2] tracking-[-0.015em]',
    h4: 'text-[clamp(1.25rem,1.75vw,1.75rem)] font-semibold leading-[1.25] tracking-[-0.01em]',
};

export function Heading({
    children,
    className,
    as,
    level = 'h2',
    tracking,
    align,
}: HeadingProps) {
    const Component = as || (level === 'display' ? 'h1' : level);

    return (
        <Component
            className={cn(
                'text-foreground',
                levelStyles[level],
                {
                    'tracking-tight': tracking === 'tight',
                    'tracking-normal': tracking === 'normal',
                    'tracking-wide': tracking === 'wide',
                    'text-left': align === 'left',
                    'text-center': align === 'center',
                    'text-right': align === 'right',
                },
                className
            )}
        >
            {children}
        </Component>
    );
}