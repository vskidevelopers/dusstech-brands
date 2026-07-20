'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';
import { DesktopNavigation } from './DesktopNavigation';
import { useScrollDirection } from '../hooks';
import { useWebsiteUIStore } from '@/store/useWebsiteUIStore';
import { useCartStore } from '@/store/useCartStore';
import { cn } from '@/lib/utils';

export function Navbar() {
    const { direction, scrollY } = useScrollDirection();
    const { openSearch, openMobileNav } = useWebsiteUIStore();
    const totalItems = useCartStore((s) => s.totalItems());
    const openCart = useCartStore((s) => s.openCart);

    const isSolid = scrollY > 50;
    const isHidden = direction === 'down' && scrollY > 200;

    return (
        <motion.header
            initial={false}
            animate={{ y: isHidden ? -100 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={cn(
                'sticky top-0 z-50 w-full transition-all duration-300',
                isSolid
                    ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-sm'
                    : 'bg-transparent'
            )}
        >
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className={cn(
                            'flex items-center gap-2 text-lg font-bold tracking-tight transition-colors',
                            isSolid ? 'text-foreground' : 'text-white'
                        )}
                    >
                        <span className="text-primary">Dusstech</span>
                        <span>Brands</span>
                    </Link>

                    {/* Desktop Nav */}
                    <DesktopNavigation variant={isSolid ? 'solid' : 'transparent'} />

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={openSearch}
                            aria-label="Search"
                            className={cn(
                                'hidden sm:flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                                isSolid
                                    ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                            )}
                        >
                            <Search className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            onClick={openCart}
                            aria-label={`Cart with ${totalItems} items`}
                            className={cn(
                                'relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                                isSolid
                                    ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    : 'text-white/80 hover:text-white hover:bg-white/10'
                            )}
                        >
                            <ShoppingBag className="h-4 w-4" />
                            {totalItems > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                                    {totalItems}
                                </span>
                            )}
                        </button>

                        <Button size="sm" className="hidden lg:inline-flex" asChild>
                            <Link href="/contact">Get a Quote</Link>
                        </Button>

                        <button
                            type="button"
                            onClick={openMobileNav}
                            aria-label="Open menu"
                            className={cn(
                                'md:hidden flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                                isSolid
                                    ? 'text-foreground hover:bg-muted'
                                    : 'text-white hover:bg-white/10'
                            )}
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}