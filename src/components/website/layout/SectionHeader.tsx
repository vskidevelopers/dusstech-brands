import { cn } from '@/lib/utils';
import { Heading } from '../ui/Heading';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';

interface SectionHeaderProps {
    eyebrow?: string;
    title: string;
    description?: string;
    align?: 'left' | 'center';
    className?: string;
    max_width?: 'sm' | 'md' | 'lg' | 'xl';
}

export function SectionHeader({
    eyebrow,
    title,
    description,
    align = 'center',
    className,
    max_width = 'md',
}: SectionHeaderProps) {
    return (
        <div
            className={cn(
                'mb-12 md:mb-16',
                {
                    'text-center': align === 'center',
                    'text-left': align === 'left',
                },
                className
            )}
        >
            {eyebrow && (
                <Badge variant="default" size="sm" className="mb-4">
                    {eyebrow}
                </Badge>
            )}
            <Heading level="h2" align={align} className="mb-4">
                {title}
            </Heading>
            {description && (
                <Text
                    variant="bodyLarge"
                    color="muted"
                    align={align}
                    className={cn('mx-auto', {
                        'max-w-screen-sm': max_width === 'sm',
                        'max-w-screen-md': max_width === 'md',
                        'max-w-screen-lg': max_width === 'lg',
                        'max-w-screen-xl': max_width === 'xl',
                    })}
                >
                    {description}
                </Text>
            )}
        </div>
    );
}