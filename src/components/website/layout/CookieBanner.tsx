/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useWebsiteUIStore } from '@/store/useWebsiteUIStore';
import { cn } from '@/lib/utils';

export function CookieBanner() {
    const { isCookieBannerDismissed, dismissCookieBanner } = useWebsiteUIStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem('dusstech-cookies-accepted') === 'true';
        if (accepted) dismissCookieBanner();
        setMounted(true);
    }, [dismissCookieBanner]);

    if (!mounted || isCookieBannerDismissed) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-md"
            >
                <div className="rounded-2xl border border-border bg-card p-5 shadow-2xl">
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Cookie className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold">We value your privacy</h3>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                We use cookies to enhance your browsing experience and analyze site traffic.
                            </p>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" onClick={dismissCookieBanner}>
                                    Accept
                                </Button>
                                <Button size="sm" variant="outline" onClick={dismissCookieBanner}>
                                    Decline
                                </Button>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={dismissCookieBanner}
                            aria-label="Close"
                            className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}