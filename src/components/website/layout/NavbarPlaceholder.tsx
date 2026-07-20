// src/components/website/layout/NavbarPlaceholder.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui';
import { cn } from '@/lib/utils';

export function NavbarPlaceholder() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <Container size="xl">
                <div className="flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
                        <span className="text-primary">Dusstech</span>
                        <span className="text-foreground">Brands</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        {['Services', 'Products', 'Portfolio', 'About', 'Contact'].map((item) => (
                            <Link
                                key={item}
                                href={`/${item.toLowerCase()}`}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin">Sign in</Link>
                        </Button>
                        <Button size="sm" asChild>
                            <Link href="/contact">Get a Quote</Link>
                        </Button>
                    </div>

                    <button
                        type="button"
                        className="md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {mobileOpen && (
                    <div className="md:hidden py-4 border-t border-border">
                        <nav className="flex flex-col gap-3">
                            {['Services', 'Products', 'Portfolio', 'About', 'Contact'].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    className="text-sm font-medium py-2"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                            <div className="flex gap-2 pt-3 border-t border-border">
                                <Button variant="outline" size="sm" className="flex-1" asChild>
                                    <Link href="/admin">Sign in</Link>
                                </Button>
                                <Button size="sm" className="flex-1" asChild>
                                    <Link href="/contact">Get a Quote</Link>
                                </Button>
                            </div>
                        </nav>
                    </div>
                )}
            </Container>
        </header>
    );
}