/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { motion, type MotionProps, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FadeUpProps extends MotionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    as?: keyof typeof motion;
}

export function FadeUp({
    children,
    className,
    delay = 0,
    duration = 0.5,
    as: Component = 'div',
    ...props
}: FadeUpProps) {
    const MotionComponent = (motion as any)[Component] || motion.div;

    return (
        <MotionComponent
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{
                duration,
                delay,
                ease: [0.4, 0, 0.2, 1],
            }}
            className={cn(className)}
            {...props}
        >
            {children}
        </MotionComponent>
    );
}