import { cn } from '@/lib/utils';

interface TextProps {
    children: React.ReactNode;
    className?: string;
    as?: 'p' | 'span' | 'div' | 'label';
    variant?: 'body' | 'bodyLarge' | 'small' | 'caption' | 'label';
    color?: 'default' | 'muted' | 'foreground' | 'primary' | 'accent';
    align?: 'left' | 'center' | 'right';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

const variantStyles = {
    body: 'text-[1.0625rem] leading-[1.6] tracking-[-0.003em]',
    bodyLarge: 'text-[1.1875rem] leading-[1.6] tracking-[-0.003em]',
    small: 'text-sm leading-[1.5]',
    caption: 'text-xs leading-[1.4] tracking-[0.01em] font-medium',
    label: 'text-xs uppercase tracking-[0.08em] font-semibold',
};

const colorStyles = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    foreground: 'text-foreground',
    primary: 'text-primary',
    accent: 'text-accent',
};

export function Text({
    children,
    className,
    as: Component = 'p',
    variant = 'body',
    color = 'default',
    align,
    weight,
}: TextProps) {
    return (
        <Component
            className={cn(
                variantStyles[variant],
                colorStyles[color],
                {
                    'text-left': align === 'left',
                    'text-center': align === 'center',
                    'text-right': align === 'right',
                    'font-normal': weight === 'normal',
                    'font-medium': weight === 'medium',
                    'font-semibold': weight === 'semibold',
                    'font-bold': weight === 'bold',
                },
                className
            )}
        >
            {children}
        </Component>
    );
}