'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PHRASES = [
    'For Your Business',
    'For Your Team',
    'For Your Event',
    'For Your School',
    'For Yourself',
];

export function HeroRotatingText() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % PHRASES.length);
        }, 2800);
        return () => clearInterval(interval);
    }, []);

    return (
        <span className="relative inline-block align-bottom">
            <span className="sr-only">{PHRASES[index]}</span>
            <span aria-hidden className="relative inline-block min-w-[1ch]">
                <AnimatePresence mode="wait">
                    <motion.span
                        key={PHRASES[index]}
                        initial={{ y: '0.6em', opacity: 0, filter: 'blur(6px)' }}
                        animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ y: '-0.6em', opacity: 0, filter: 'blur(6px)' }}
                        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                        className="inline-block bg-gradient-to-r from-primary via-primary-400 to-accent bg-clip-text text-transparent"
                    >
                        {PHRASES[index]}
                    </motion.span>
                </AnimatePresence>
            </span>
        </span>
    );
}