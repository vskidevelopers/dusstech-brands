// src/components/website/motion/SlideLeft.tsx
'use client';

import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SlideProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function SlideLeft({ children, className, delay = 0, ...props }: SlideProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}