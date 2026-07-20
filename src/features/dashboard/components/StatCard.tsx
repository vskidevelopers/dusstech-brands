/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { fadeInUp } from '../animations';
import type { StatCardData } from '../types';
import { cn } from '@/lib/utils';

interface StatCardProps {
    data: StatCardData;
}

export function StatCard({ data }: StatCardProps) {
    const { label, value, helper, icon, accent, accentText } = data;

    return (
        <motion.div variants={fadeInUp as any} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110', accent)}>
                            {/* ✅ Render icon directly — it's already a React Element */}
                            <span className={cn(accentText)}>{icon}</span>
                        </div>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-baseline gap-1">
                            <span className="text-3xl font-bold tracking-tight tabular-nums">{value}</span>
                        </div>
                        <p className="mt-1 text-sm font-medium text-foreground">{label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{helper}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}