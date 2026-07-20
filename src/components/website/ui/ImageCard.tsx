import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageCardProps {
    src: string;
    alt: string;
    title?: string;
    subtitle?: string;
    aspectRatio?: 'square' | 'video' | 'wide' | 'portrait';
    className?: string;
}

export function ImageCard({
    src,
    alt,
    title,
    subtitle,
    aspectRatio = 'video',
    className,
}: ImageCardProps) {
    return (
        <div className={cn('group relative overflow-hidden rounded-2xl', className)}>
            <div
                className={cn(
                    'relative w-full overflow-hidden bg-muted',
                    {
                        'aspect-square': aspectRatio === 'square',
                        'aspect-video': aspectRatio === 'video',
                        'aspect-[16/10]': aspectRatio === 'wide',
                        'aspect-[3/4]': aspectRatio === 'portrait',
                    }
                )}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
            {(title || subtitle) && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                    {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
                    {subtitle && <p className="mt-1 text-sm text-white/80">{subtitle}</p>}
                </div>
            )}
        </div>
    );
}