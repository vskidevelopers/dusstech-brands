/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, TrendingUp, Clock, Package, Wrench } from 'lucide-react';
import { useWebsiteUIStore } from '@/store/useWebsiteUIStore';
import { useLockedBody, useKeyboardShortcut } from '../hooks';
import { cn } from '@/lib/utils';

const TRENDING_SEARCHES = [
    { label: 'Logo Design', href: '/services/logo-design', icon: Wrench },
    { label: 'Custom T-Shirts', href: '/shop/t-shirts', icon: Package },
    { label: '3D Signage', href: '/services/3d-signage', icon: Wrench },
    { label: 'Business Cards', href: '/services/business-cards', icon: Package },
];

export function SearchOverlay() {
    const { isSearchOpen, closeSearch, openSearch } = useWebsiteUIStore();
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useLockedBody(isSearchOpen);
    useKeyboardShortcut('k', openSearch, { meta: true, ctrl: true });

    useEffect(() => {
        if (isSearchOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        } else {
            setQuery('');
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isSearchOpen) closeSearch();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isSearchOpen, closeSearch]);

    return (
        <AnimatePresence>
            {isSearchOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        onClick={closeSearch}
                        className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm"
                        aria-hidden
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -10 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed left-1/2 top-[10vh] z-[80] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Search"
                    >
                        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                            {/* Search Input */}
                            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search services, products, portfolio..."
                                    className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                                />
                                <kbd className="hidden sm:inline-flex h-6 items-center rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                                    ESC
                                </kbd>
                            </div>

                            {/* Content */}
                            <div className="max-h-[60vh] overflow-y-auto p-3">
                                {query === '' ? (
                                    <>
                                        <div className="px-2 pb-2">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                <TrendingUp className="h-3 w-3" />
                                                Trending
                                            </div>
                                        </div>
                                        <ul className="space-y-0.5">
                                            {TRENDING_SEARCHES.map((item) => (
                                                <li key={item.href}>
                                                    <a
                                                        href={item.href}
                                                        onClick={closeSearch}
                                                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-muted transition-colors"
                                                    >
                                                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                                                            <item.icon className="h-4 w-4" />
                                                        </div>
                                                        <span className="flex-1 text-sm font-medium">{item.label}</span>
                                                        <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-4 px-2 pb-2">
                                            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                Recent
                                            </div>
                                        </div>
                                        <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                                            No recent searches
                                        </div>
                                    </>
                                ) : (
                                    <div className="px-3 py-12 text-center">
                                        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                            <Search className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <p className="text-sm font-medium">No results for &quot;{query}&quot;</p>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            Try a different search term
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <kbd className="flex h-5 w-5 items-center justify-center rounded border border-border bg-muted">↑</kbd>
                                        <kbd className="flex h-5 w-5 items-center justify-center rounded border border-border bg-muted">↓</kbd>
                                        <span className="ml-1">Navigate</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <kbd className="flex h-5 items-center justify-center rounded border border-border bg-muted px-1.5">↵</kbd>
                                        <span className="ml-1">Select</span>
                                    </span>
                                </div>
                                <span>Powered by Dusstech</span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}