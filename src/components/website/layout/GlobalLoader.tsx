'use client';

import { motion } from 'framer-motion';

export function GlobalLoader() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: [0, 1, 0] }}
                            transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: 'easeInOut',
                            }}
                            className="h-2.5 w-2.5 rounded-full bg-primary"
                        />
                    ))}
                </div>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground"
                >
                    Dusstech Brands
                </motion.p>
            </div>
        </div>
    );
}