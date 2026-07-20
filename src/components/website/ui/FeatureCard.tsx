import { cn } from '@/lib/utils';
import { Card } from './Card';

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
    return (
        <Card variant="bordered" padding="lg" className={cn('group', className)}>
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {icon}
            </div>
            <h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3>
            <p className="text-muted-foreground leading-relaxed">{description}</p>
        </Card>
    );
}