/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useWebsiteUIStore } from '@/store/useWebsiteUIStore';
import { cn } from '@/lib/utils';

export function AnnouncementBar() {
    const { isAnnouncementDismissed, dismissAnnouncement } = useWebsiteUIStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('dusstech-announcement-dismissed') === 'true';
        if (dismissed) dismissAnnouncement();
        setMounted(true);
    }, [dismissAnnouncement]);

    if (!mounted || isAnnouncementDismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-600 to-primary-700 text-primary-foreground"
            >
                <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center gap-3 py-2.5 text-center text-sm">
                        <Sparkles className="h-4 w-4 shrink-0" aria-hidden />
                        <p className="font-medium">
                            <span className="hidden sm:inline">Free brand consultation this month. </span>
                            <a href="/contact" className="underline underline-offset-2 hover:no-underline">
                                Book yours →
                            </a>
                        </p>
                        <button
                            type="button"
                            onClick={dismissAnnouncement}
                            aria-label="Dismiss announcement"
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/10 transition-colors"
                        >
                            <X className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}