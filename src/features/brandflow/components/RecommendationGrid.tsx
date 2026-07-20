'use client';

import { useMemo } from 'react';
import { RecommendationCard } from './RecommendationCard';
import type { Recommendation } from '../types';

interface RecommendationGridProps {
    recommendations: Recommendation[];
    maxItems?: number;
}

export function RecommendationGrid({ recommendations, maxItems = 8 }: RecommendationGridProps) {
    const visible = useMemo(
        () => recommendations.slice(0, maxItems),
        [recommendations, maxItems]
    );

    if (visible.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                    No specific recommendations yet. Let&apos;s chat about your project!
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((rec, index) => (
                <RecommendationCard key={rec.id} recommendation={rec} index={index} />
            ))}
        </div>
    );
}