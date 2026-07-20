'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/website/ui/Badge';
import { cn } from '@/lib/utils';
import type { Recommendation } from '../types';

interface RecommendationCardProps {
    recommendation: Recommendation;
    index: number;
}

const typeLabels: Record<Recommendation['type'], string> = {
    service: 'Service',
    product: 'Product',
    collection: 'Collection',
    portfolio: 'Inspiration',
};

const typeVariants: Record<Recommendation['type'], 'default' | 'accent' | 'secondary' | 'outline'> = {
    service: 'default',
    product: 'accent',
    collection: 'secondary',
    portfolio: 'outline',
};

export function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
    const Icon = recommendation.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
        >
            <Link
                href={recommendation.href}
                className={cn(
                    'group relative flex flex-col h-full rounded-2xl border border-border bg-card p-5',
                    'transition-all duration-200 hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
                )}
            >
                <div className="flex items-start justify-between mb-3">
                    <Badge variant={typeVariants[recommendation.type]} size="sm">
                        {typeLabels[recommendation.type]}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>

                {Icon && (
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                    </div>
                )}

                <h3 className="text-base font-semibold tracking-tight text-foreground mb-1.5">
                    {recommendation.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {recommendation.description}
                </p>
            </Link>
        </motion.div>
    );
}