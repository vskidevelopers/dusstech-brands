import { cn } from '@/lib/utils';

interface StatProps {
    value: string | number;
    label: string;
    suffix?: string;
    className?: string;
}

export function Stat({ value, label, suffix, className }: StatProps) {
    return (
        <div className={cn('text-center', className)}>
            <div className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {value}
                {suffix && <span className="text-primary">{suffix}</span>}
            </div>
            <div className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {label}
            </div>
        </div>
    );
}