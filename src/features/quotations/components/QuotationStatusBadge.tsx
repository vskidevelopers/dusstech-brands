import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { QuotationStatus } from '../types';

const statusStyles: Record<QuotationStatus, string> = {
    draft: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
    sent: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    approved: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    rejected: 'bg-red-500/10 text-red-600 dark:text-red-400',
    expired: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
    converted: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

export function QuotationStatusBadge({ status }: { status: QuotationStatus }) {
    return (
        <Badge variant="secondary" className={cn('font-medium capitalize', statusStyles[status])}>
            {status}
        </Badge>
    );
}