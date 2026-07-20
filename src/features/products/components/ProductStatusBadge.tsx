import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductStatusBadgeProps {
    active: boolean;
    className?: string;
}

export function ProductStatusBadge({ active, className }: ProductStatusBadgeProps) {
    return (
        <Badge
            variant={active ? 'default' : 'secondary'}
            className={cn(
                'font-medium',
                active
                    ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400'
                    : 'bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20',
                className
            )}
        >
            {active ? 'Active' : 'Archived'}
        </Badge>
    );
}