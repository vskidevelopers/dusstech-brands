// src/components/website/ui/Quote.tsx
import { cn } from '@/lib/utils';

interface QuoteProps {
    children: React.ReactNode;
    author?: string;
    role?: string;
    className?: string;
}

export function Quote({ children, author, role, className }: QuoteProps) {
    return (
        <figure className={cn('relative', className)}>
            <blockquote className="text-2xl md:text-3xl font-medium leading-snug tracking-tight text-foreground">
                <span className="text-primary">&quot;</span>
                {children}
                <span className="text-primary">&quot;</span>
            </blockquote>
            {(author || role) && (
                <figcaption className="mt-6">
                    {author && <div className="font-semibold">{author}</div>}
                    {role && <div className="text-sm text-muted-foreground">{role}</div>}
                </figcaption>
            )}
        </figure>
    );
}