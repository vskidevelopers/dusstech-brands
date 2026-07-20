import { cn } from '@/lib/utils';
import { Container } from '../ui/Container';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Breadcrumb } from './Breadcrumb';
import type { ComponentProps } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumbs?: ComponentProps<typeof Breadcrumb>['items'];
    eyebrow?: string;
    align?: 'left' | 'center';
    className?: string;
    children?: React.ReactNode;
}

export function PageHeader({
    title,
    description,
    breadcrumbs,
    eyebrow,
    align = 'center',
    className,
    children,
}: PageHeaderProps) {
    return (
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-canvas to-background py-16 md:py-20 lg:py-24">
            {/* Subtle mesh background */}
            <div
                className="pointer-events-none absolute inset-0 opacity-50"
                style={{
                    backgroundImage: `
            radial-gradient(at 20% 20%, hsl(var(--primary) / 0.08) 0%, transparent 50%),
            radial-gradient(at 80% 80%, hsl(var(--accent) / 0.06) 0%, transparent 50%)
          `,
                }}
                aria-hidden
            />

            <Container size="xl" className="relative">
                <div className={cn('flex flex-col gap-6', align === 'center' && 'items-center text-center')}>
                    {breadcrumbs && <Breadcrumb items={breadcrumbs} />}

                    <div className="space-y-4 max-w-3xl">
                        {eyebrow && (
                            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
                                {eyebrow}
                            </p>
                        )}
                        <Heading level="h1" align={align}>
                            {title}
                        </Heading>
                        {description && (
                            <Text variant="bodyLarge" color="muted" align={align} className="max-w-2xl">
                                {description}
                            </Text>
                        )}
                    </div>

                    {children}
                </div>
            </Container>
        </section>
    );
}