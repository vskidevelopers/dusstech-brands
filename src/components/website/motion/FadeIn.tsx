'use client';

import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeInProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
}

export function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.5,
    ...props
}: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}