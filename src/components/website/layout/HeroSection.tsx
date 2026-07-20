import { cn } from '@/lib/utils';
import { Container } from '@/components/website/ui/Container';

interface HeroSectionProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default' | 'centered' | 'split';
    mesh?: boolean;
}

export function HeroSection({
    children,
    className,
    variant = 'centered',
    mesh = false,
}: HeroSectionProps) {
    return (
        <section
            className={cn(
                'relative overflow-hidden py-20 md:py-28 lg:py-36',
                {
                    'text-center': variant === 'centered',
                },
                className
            )}
        >
            {mesh && (
                <div
                    className="pointer-events-none absolute inset-0 opacity-60"
                    style={{
                        backgroundImage: `
              radial-gradient(at 20% 20%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
              radial-gradient(at 80% 0%, hsl(var(--accent) / 0.1) 0%, transparent 50%),
              radial-gradient(at 0% 80%, hsl(var(--primary-300) / 0.1) 0%, transparent 50%)
            `,
                    }}
                    aria-hidden
                />
            )}
            <Container size="xl" className="relative">
                {children}
            </Container>
        </section>
    );
}