'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircle, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { useWebsiteUIStore } from '@/store/useWebsiteUIStore';
import { useLockedBody } from '../hooks';
import { cn } from '@/lib/utils';

const NAV_GROUPS = [
    {
        title: 'Services',
        href: '/services',
        children: [
            { label: 'Logo Design', href: '/services/logo-design' },
            { label: 'Brand Identity', href: '/services/brand-identity' },
            { label: 'Print & Signage', href: '/services/print-signage' },
        ],
    },
    {
        title: 'Shop',
        href: '/shop',
        children: [
            { label: 'Apparel', href: '/shop/apparel' },
            { label: 'Corporate Gifts', href: '/shop/corporate' },
            { label: 'Collections', href: '/shop/collections' },
        ],
    },
    { title: 'Portfolio', href: '/portfolio' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
];

export function MobileNavigation() {
    const pathname = usePathname();
    const { isMobileNavOpen, closeMobileNav } = useWebsiteUIStore();
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

    useLockedBody(isMobileNavOpen);

    return (
        <AnimatePresence>
            {isMobileNavOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={closeMobileNav}
                        className="fixed inset-0 z-[55] bg-black/50 backdrop-blur-sm md:hidden"
                        aria-hidden
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 35 }}
                        className="fixed inset-y-0 right-0 z-[60] flex w-full max-w-sm flex-col bg-background md:hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-border px-5 py-4">
                            <span className="text-lg font-bold tracking-tight">
                                <span className="text-primary">Dusstech</span> Brands
                            </span>
                            <button
                                type="button"
                                onClick={closeMobileNav}
                                aria-label="Close menu"
                                className="rounded-full p-2 hover:bg-muted transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Nav */}
                        <nav className="flex-1 overflow-y-auto px-5 py-6" aria-label="Mobile navigation">
                            <ul className="space-y-1">
                                {NAV_GROUPS.map((group) => {
                                    const isActive = pathname === group.href;
                                    const hasChildren = !!group.children;
                                    const isExpanded = expandedGroup === group.title;

                                    return (
                                        <li key={group.href}>
                                            <div className="flex items-center">
                                                <Link
                                                    href={group.href}
                                                    onClick={closeMobileNav}
                                                    className={cn(
                                                        'flex-1 rounded-lg px-3 py-3 text-base font-medium transition-colors',
                                                        isActive ? 'text-primary bg-primary/5' : 'text-foreground hover:bg-muted'
                                                    )}
                                                >
                                                    {group.title}
                                                </Link>
                                                {hasChildren && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setExpandedGroup(isExpanded ? null : group.title)}
                                                        aria-label={`Toggle ${group.title} submenu`}
                                                        aria-expanded={isExpanded}
                                                        className="rounded-lg p-2 hover:bg-muted transition-colors"
                                                    >
                                                        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                                            <ChevronDown className="h-4 w-4" />
                                                        </motion.div>
                                                    </button>
                                                )}
                                            </div>

                                            <AnimatePresence>
                                                {hasChildren && isExpanded && (
                                                    <motion.ul
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="overflow-hidden pl-4"
                                                    >
                                                        {group.children!.map((child) => (
                                                            <li key={child.href}>
                                                                <Link
                                                                    href={child.href}
                                                                    onClick={closeMobileNav}
                                                                    className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Footer CTAs */}
                        <div className="border-t border-border p-5 space-y-2">
                            <Button className="w-full" asChild>
                                <Link href="/contact" onClick={closeMobileNav}>
                                    Get a Quote
                                </Link>
                            </Button>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" size="sm" asChild>
                                    <a
                                        href="https://wa.me/254722277778"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={closeMobileNav}
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        WhatsApp
                                    </a>
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href="/shop" onClick={closeMobileNav}>
                                        <ShoppingBag className="h-4 w-4" />
                                        Shop
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}