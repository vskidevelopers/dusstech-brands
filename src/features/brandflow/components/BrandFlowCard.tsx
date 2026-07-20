// src/features/brandflow/components/BrandFlowCard.tsx
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/website/ui/Card';
import { cn } from '@/lib/utils';

interface BrandFlowCardProps {
    children: React.ReactNode;
    className?: string;
}

export function BrandFlowCard({ children, className }: BrandFlowCardProps) {
    return (
        <Card variant="bordered" padding="none" className={cn('overflow-hidden', className)}>
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-5 py-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-semibold tracking-tight">BrandFlow</span>
                <span className="text-xs text-muted-foreground">· Guided discovery</span>
            </div>
            <div className="p-6 md:p-8">{children}</div>
        </Card>
    );
}