'use client';

import Image from 'next/image';
import { FloatingElement } from '@/components/website/motion';
import { cn } from '@/lib/utils';

interface HeroCollageProps {
    images: string[];
}

export function HeroCollage({ images }: HeroCollageProps) {
    // Fallback images if none provided
    const fallbacks = [
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
        'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&q=80',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3d990?w=600&q=80',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80',
    ];

    const srcs = images.length > 0 ? images : fallbacks;

    // Layout positions (percentage-based for responsiveness)
    const positions = [
        { top: '0%', left: '15%', size: 'w-40 h-40 md:w-52 md:h-52', delay: 0, distance: 8 },
        { top: '20%', left: '55%', size: 'w-36 h-36 md:w-48 md:h-48', delay: 0.5, distance: 10 },
        { top: '50%', left: '5%', size: 'w-32 h-32 md:w-44 md:h-44', delay: 1, distance: 6 },
        { top: '55%', left: '48%', size: 'w-40 h-40 md:w-52 md:h-52', delay: 1.5, distance: 12 },
        { top: '15%', left: '80%', size: 'w-28 h-28 md:w-36 md:h-36', delay: 2, distance: 7 },
    ];

    return (
        <div className="relative h-[480px] w-full md:h-[560px]">
            {/* Background glow */}
            <div
                className="absolute inset-0 opacity-40"
                style={{
                    backgroundImage: `radial-gradient(at 50% 50%, hsl(var(--primary) / 0.25) 0%, transparent 60%)`,
                }}
                aria-hidden
            />

            {srcs.slice(0, 5).map((src, i) => {
                const pos = positions[i];
                return (
                    <FloatingElement
                        key={i}
                        duration={4 + i * 0.5}
                        distance={pos.distance}
                        className={cn('absolute', pos.size)}
                        // @ts-expect-error - style prop passthrough
                        style={{ top: pos.top, left: pos.left }}
                    >
                        <div className="group relative h-80 w-full overflow-hidden rounded-3xl border border-border/40 bg-card shadow-xl transition-transform duration-500 hover:scale-105">
                            <Image
                                src={src}
                                alt={`Dusstech product ${i + 1}`}
                                fill
                                className="object-cover"

                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                    </FloatingElement>
                );
            })}
        </div>
    );
}