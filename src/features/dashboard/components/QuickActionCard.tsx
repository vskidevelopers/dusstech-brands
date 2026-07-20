/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { fadeInUp } from '../animations';
import type { QuickActionData } from '../types';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
    data: QuickActionData;
}

export function QuickActionCard({ data }: QuickActionCardProps) {
    const { title, description, icon, href, accent, accentText } = data;

    return (
        <motion.div variants={fadeInUp as any} whileHover={{ y: -2 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
            <Link href={href} className="group block h-full">
                <Card className="relative h-full overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex h-full flex-col p-5">
                        <div className="flex items-start justify-between">
                            <div className={cn('flex h-11 w-11 items-center justify-center rounded-lg transition-transform group-hover:scale-110', accent)}>
                                {/* ✅ Render icon directly — it's already a React Element */}
                                <span className={cn(accentText)}>{icon}</span>
                            </div>
                            <motion.div
                                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
                                aria-hidden
                            >
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </motion.div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{description}</p>
                        </div>
                    </div>
                </Card>
            </Link>
        </motion.div>
    );
}