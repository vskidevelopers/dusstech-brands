/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingElementProps {
    children: React.ReactNode;
    className?: string;
    duration?: number;
    distance?: number;
    style?: any;
}

export function FloatingElement({
    children,
    className,
    duration = 4,
    distance = 10,
    style, ...props
}: FloatingElementProps) {
    return (
        <motion.div
            animate={{ y: [0, -distance, 0] }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            className={cn("relative", className)}
            style={style}
            {...props}
        >
            {children}
        </motion.div>
    );
}