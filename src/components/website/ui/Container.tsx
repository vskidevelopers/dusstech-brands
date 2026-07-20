import { cn } from '@/lib/utils';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function Container({
    children,
    className,
    size = 'xl',
}: ContainerProps) {
    return (
        <div
            className={cn(
                'mx-auto w-full px-4 sm:px-6 lg:px-8',
                {
                    'max-w-screen-sm': size === 'sm',
                    'max-w-screen-md': size === 'md',
                    'max-w-screen-lg': size === 'lg',
                    'max-w-[1200px]': size === 'xl',
                    'max-w-[1400px]': size === '2xl',
                    'max-w-full': size === 'full',
                },
                className
            )}
        >
            {children}
        </div>
    );
}