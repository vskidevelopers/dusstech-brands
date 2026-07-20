'use client';

import { motion } from 'framer-motion';

export function RouteLoader() {
    return (
        <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ scaleX: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 right-0 z-[70] h-0.5 origin-left bg-gradient-to-r from-primary to-accent"
            aria-hidden
        />
    );
}