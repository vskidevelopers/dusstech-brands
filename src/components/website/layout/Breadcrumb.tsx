import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    return (
        <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1.5 text-sm', className)}>
            <Link
                href="/"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
                <Home className="h-3.5 w-3.5" />
                <span className="sr-only">Home</span>
            </Link>
            {items.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden />
                    {item.href && index < items.length - 1 ? (
                        <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="font-medium text-foreground" aria-current="page">
                            {item.label}
                        </span>
                    )}
                </div>
            ))}
        </nav>
    );
}