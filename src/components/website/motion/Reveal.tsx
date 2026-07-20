'use client';

import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface RevealProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

export function Reveal({ children, className, delay = 0, ...props }: RevealProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}