'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border shadow-sm">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between gap-4">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground"
                    >
                        <span className="text-primary">Dusstech</span>
                        <span>Brands</span>
                    </Link>

                    {/* Desktop Nav - temporarily removed */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/services" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Services
                        </Link>
                        <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Shop
                        </Link>
                        <Link href="/portfolio" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Portfolio
                        </Link>
                        <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            About
                        </Link>
                        <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                            Contact
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            aria-label="Search"
                            className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <Search className="h-4 w-4" />
                        </button>

                        <button
                            type="button"
                            aria-label="Cart"
                            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                            <ShoppingBag className="h-4 w-4" />
                        </button>

                        <Button size="sm" className="hidden lg:inline-flex" asChild>
                            <Link href="/contact">Get a Quote</Link>
                        </Button>

                        <button
                            type="button"
                            aria-label="Open menu"
                            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-muted transition-colors"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}