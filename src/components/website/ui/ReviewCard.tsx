// src/components/website/ui/ReviewCard.tsx
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card } from './Card';

interface ReviewCardProps {
    quote: string;
    author: string;
    role?: string;
    avatar?: string;
    rating?: number;
    className?: string;
}

export function ReviewCard({ quote, author, role, avatar, rating, className }: ReviewCardProps) {
    return (
        <Card variant="bordered" padding="lg" className={cn('flex flex-col', className)}>
            {rating && (
                <div className="mb-4 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <svg key={i} className={cn('h-4 w-4', i < rating ? 'text-accent fill-accent' : 'text-muted fill-muted')} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                    ))}
                </div>
            )}
            <p className="flex-1 text-foreground leading-relaxed">&quot;{quote}&quot;</p>
            <div className="mt-6 flex items-center gap-3">
                {avatar && (
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-muted">
                        <Image src={avatar} alt={author} fill className="object-cover" />
                    </div>
                )}
                <div>
                    <div className="font-semibold text-sm">{author}</div>
                    {role && <div className="text-xs text-muted-foreground">{role}</div>}
                </div>
            </div>
        </Card>
    );
}