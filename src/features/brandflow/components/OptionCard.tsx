'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { FlowOption } from '../types';

interface OptionCardProps {
    option: FlowOption;
    index: number;
    onClick: () => void;
    variant?: 'default' | 'compact';
}

export function OptionCard({ option, index, onClick, variant = 'default' }: OptionCardProps) {
    const Icon = option.icon;

    return (
        <motion.button
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.35,
                delay: index * 0.05,
                ease: [0.4, 0, 0.2, 1],
            }}
            whileHover={{ y: -2, transition: { duration: 0.15 } }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                'group relative flex flex-col text-left rounded-2xl border border-border bg-card',
                'transition-all duration-200 hover:shadow-md hover:border-primary/40',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                variant === 'default' ? 'p-5' : 'p-4'
            )}
            aria-label={option.label}
        >
            {Icon && (
                <div
                    className={cn(
                        'mb-3 flex items-center justify-center rounded-xl bg-primary/10 text-primary',
                        'transition-colors group-hover:bg-primary group-hover:text-primary-foreground',
                        variant === 'default' ? 'h-11 w-11' : 'h-9 w-9'
                    )}
                >
                    <Icon className={variant === 'default' ? 'h-5 w-5' : 'h-4 w-4'} />
                </div>
            )}
            <h3 className={cn('font-semibold tracking-tight text-foreground', variant === 'default' ? 'text-base' : 'text-sm')}>
                {option.label}
            </h3>
            {option.description && (
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {option.description}
                </p>
            )}
        </motion.button>
    );
}