'use client';

import { useScrollProgress } from '../hooks';

export function ScrollProgress() {
    const progress = useScrollProgress();

    return (
        <div
            className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent pointer-events-none"
            aria-hidden
        >
            <div
                className="h-full bg-gradient-to-r from-primary via-primary-400 to-accent origin-left transition-transform duration-150 ease-out"
                style={{ transform: `scaleX(${progress / 100})` }}
            />
        </div>
    );
}