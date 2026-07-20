import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ProductionStatus } from '../types';

const styles: Record<ProductionStatus, string> = {
    new: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    awaiting_review: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
    artwork: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
    awaiting_approval: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    approved: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
    production: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    quality_check: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
    ready: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    completed: 'bg-green-500/10 text-green-600 dark:text-green-400',
    cancelled: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
    on_hold: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
};

const labels: Record<ProductionStatus, string> = {
    new: 'New',
    awaiting_review: 'Awaiting Review',
    artwork: 'Artwork',
    awaiting_approval: 'Awaiting Approval',
    approved: 'Approved',
    production: 'In Production',
    quality_check: 'Quality Check',
    ready: 'Ready',
    completed: 'Completed',
    cancelled: 'Cancelled',
    on_hold: 'On Hold',
};

export function ProductionStatusBadge({ status }: { status: ProductionStatus }) {
    return (
        <Badge variant="secondary" className={cn('font-medium', styles[status])}>
            {labels[status]}
        </Badge>
    );
}