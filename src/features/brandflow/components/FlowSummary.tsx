'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface FlowSummaryProps {
    journey: Array<{ stepTitle: string; answerLabel: string }>;
}

export function FlowSummary({ journey }: FlowSummaryProps) {
    if (journey.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-border bg-muted/30 p-5"
        >
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Your selections
            </h4>
            <ul className="space-y-2">
                {journey.map((item, index) => (
                    <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                        className="flex items-start gap-2.5 text-sm"
                    >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Check className="h-3 w-3" strokeWidth={3} />
                        </div>
                        <div>
                            <span className="text-muted-foreground">{item.stepTitle} — </span>
                            <span className="font-medium text-foreground">{item.answerLabel}</span>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </motion.div>
    );
}