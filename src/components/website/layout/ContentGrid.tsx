import { cn } from '@/lib/utils';

interface ContentGridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3 | 4;
    gap?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function ContentGrid({
    children,
    columns = 3,
    gap = 'lg',
    className,
}: ContentGridProps) {
    return (
        <div
            className={cn(
                'grid',
                {
                    'grid-cols-1': columns === 1,
                    'grid-cols-1 md:grid-cols-2': columns === 2,
                    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3': columns === 3,
                    'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4': columns === 4,
                    'gap-4': gap === 'sm',
                    'gap-6': gap === 'md',
                    'gap-8': gap === 'lg',
                },
                className
            )}
        >
            {children}
        </div>
    );
}