'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useScrollDirection } from '../hooks';
import { cn } from '@/lib/utils';

export function BackToTop() {
    const { scrollY } = useScrollDirection();
    const isVisible = scrollY > 400;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    transition={{ duration: 0.2 }}
                    onClick={scrollToTop}
                    aria-label="Back to top"
                    className={cn(
                        'fixed bottom-6 right-6 z-40',
                        'h-11 w-11 rounded-full',
                        'bg-card border border-border shadow-lg',
                        'flex items-center justify-center',
                        'text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary',
                        'transition-colors duration-200'
                    )}
                >
                    <ArrowUp className="h-4 w-4" />
                </motion.button>
            )}
        </AnimatePresence>
    );
}