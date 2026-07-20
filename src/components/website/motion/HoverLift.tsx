'use client';

import { motion, type MotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HoverLiftProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    lift?: number;
}

export function HoverLift({
    children,
    className,
    lift = -4,
    ...props
}: HoverLiftProps) {
    return (
        <motion.div
            whileHover={{ y: lift, transition: { duration: 0.2 } }}
            className={cn(className)}
            {...props}
        >
            {children}
        </motion.div>
    );
}