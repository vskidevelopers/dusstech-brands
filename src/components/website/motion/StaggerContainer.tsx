'use client';

import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StaggerContainerProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    staggerDelay?: number;
}

export function StaggerContainer({
    children,
    className,
    staggerDelay = 0.1,
    ...props
}: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}

/** Use as a direct child of StaggerContainer */
export function StaggerItem({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className={cn(className)}
        >
            {children}
        </motion.div>
    );
}