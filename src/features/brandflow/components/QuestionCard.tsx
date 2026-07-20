'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { OptionCard } from './OptionCard';
import type { FlowStep, FlowOption } from '../types';

interface QuestionCardProps {
    step: FlowStep;
    onSelect: (option: FlowOption) => void;
}

export function QuestionCard({ step, onSelect }: QuestionCardProps) {
    const Icon = step.icon;
    const options = step.options ?? [];
    const layout = step.layout ?? 'grid';

    return (
        <motion.div
            key={step.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="w-full"
        >
            {/* Header */}
            <div className="mb-8 text-center">
                {Icon && (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.05 }}
                        className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
                    >
                        <Icon className="h-6 w-6" />
                    </motion.div>
                )}
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                    {step.question || step.title}
                </h2>
                {step.description && (
                    <p className="mt-3 text-base text-muted-foreground max-w-xl mx-auto">
                        {step.description}
                    </p>
                )}
            </div>

            {/* Options */}
            <div
                className={cn(
                    'grid gap-3',
                    layout === 'grid' && 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
                    layout === 'list' && 'grid-cols-1 max-w-xl mx-auto',
                    layout === 'hero' && 'grid-cols-1 sm:grid-cols-2'
                )}
                role="radiogroup"
                aria-label={step.question}
            >
                {options.map((option, index) => (
                    <OptionCard
                        key={option.id}
                        option={option}
                        index={index}
                        onClick={() => onSelect(option)}
                        variant={layout === 'list' ? 'compact' : 'default'}
                    />
                ))}
            </div>
        </motion.div>
    );
}