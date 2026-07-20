'use client';

import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScaleInProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function ScaleIn({ children, className, delay = 0, ...props }: ScaleInProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}