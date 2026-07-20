'use client';

import { motion } from 'framer-motion';
import { staggerContainer } from '../animations';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface DashboardGridProps {
    children: ReactNode;
    className?: string;
    columns?: string;
}

export function DashboardGrid({ children, className, columns = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6' }: DashboardGridProps) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className={cn('grid gap-4', columns, className)}
        >
            {children}
        </motion.div>
    );
}