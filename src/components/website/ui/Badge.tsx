import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
    'inline-flex items-center gap-1.5 rounded-full font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-primary/10 text-primary border border-primary/20',
                secondary: 'bg-secondary text-secondary-foreground',
                accent: 'bg-accent/10 text-accent border border-accent/20',
                outline: 'border border-border text-foreground',
                success: 'bg-success/10 text-success border border-success/20',
                warning: 'bg-warning/10 text-warning border border-warning/20',
                danger: 'bg-destructive/10 text-destructive border border-destructive/20',
            },
            size: {
                sm: 'px-2.5 py-0.5 text-xs',
                md: 'px-3 py-1 text-sm',
                lg: 'px-4 py-1.5 text-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
);

interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

export function Badge({ className, variant, size, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
    );
}