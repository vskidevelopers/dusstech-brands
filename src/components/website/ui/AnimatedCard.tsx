'use client';

import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function AnimatedCard({
    children,
    className,
    delay = 0,
    ...props
}: AnimatedCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
                'rounded-2xl bg-card p-6 shadow-sm border border-border transition-shadow hover:shadow-md',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}