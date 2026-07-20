'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
    children: React.ReactNode;
    className?: string;
    duration?: number;
    distance?: number;
}

export function FloatingElement({
    children,
    className,
    duration = 4,
    distance = 10,
}: FloatingElementProps) {
    return (
        <motion.div
            animate={{ y: [0, -distance, 0] }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}