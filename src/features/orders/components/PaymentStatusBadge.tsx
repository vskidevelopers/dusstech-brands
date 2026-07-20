import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { PaymentStatus } from '../types';

const styles: Record<PaymentStatus, string> = {
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    partially_paid: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    paid: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    refunded: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400',
};

const labels: Record<PaymentStatus, string> = {
    pending: 'Pending',
    partially_paid: 'Partially Paid',
    paid: 'Paid',
    refunded: 'Refunded',
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
    return (
        <Badge variant="secondary" className={cn('font-medium', styles[status])}>
            {labels[status]}
        </Badge>
    );
}