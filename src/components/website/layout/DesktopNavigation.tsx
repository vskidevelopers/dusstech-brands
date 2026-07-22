'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
    label: string;
    href: string;
}

interface MegaMenuGroup {
    title: string;
    items: NavItem[];
}

interface MegaMenuData {
    groups: MegaMenuGroup[];
    featured?: { label: string; href: string; description: string }[];
}

const NAV_ITEMS: (NavItem & { megaMenu?: MegaMenuData })[] = [
    {
        label: 'Services',
        href: '/services',
        megaMenu: {
            groups: [
                {
                    title: 'Branding',
                    items: [
                        { label: 'Logo Design', href: '/services/logo-design' },
                        { label: 'Brand Identity', href: '/services/brand-identity' },
                        { label: 'Brand Strategy', href: '/services/brand-strategy' },
                    ],
                },
                {
                    title: 'Print',
                    items: [
                        { label: 'Business Cards', href: '/services/business-cards' },
                        { label: 'Flyers & Brochures', href: '/services/flyers-brochures' },
                        { label: 'Posters & Banners', href: '/services/posters-banners' },
                    ],
                },
                {
                    title: 'Signage',
                    items: [
                        { label: '3D Signage', href: '/services/3d-signage' },
                        { label: 'Lightbox Signs', href: '/services/lightbox-signs' },
                        { label: 'Vehicle Branding', href: '/services/vehicle-branding' },
                    ],
                },
            ],
        },
    },
    {
        label: 'Shop',
        href: '/shop',
        megaMenu: {
            groups: [
                {
                    title: 'Apparel',
                    items: [
                        { label: 'T-Sh-shirts', href: '/shop/t-shirts' },
                        { label: 'Hoodies', href: '/shop/hoodies' },
                        { label: 'Caps', href: '/shop/caps' },
                    ],
                },
                {
                    title: 'Corporate',
                    items: [
                        { label: 'Notebooks', href: '/shop/notebooks' },
                        { label: 'Mugs', href: '/shop/mugs' },
                        { label: 'Pens', href: '/shop/pens' },
                    ],
                },
                {
                    title: 'Collections',
                    items: [
                        { label: 'New Arrivals', href: '/shop/new-arrivals' },
                        { label: 'Best Sellers', href: '/shop/best-sellers' },
                        { label: 'Featured', href: '/shop/featured' },
                    ],
                },
            ],
        },
    },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
];

interface DesktopNavigationProps {
    variant?: 'transparent' | 'solid';
}

export function DesktopNavigation({ variant = 'solid' }: DesktopNavigationProps) {
    const pathname = usePathname();
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    // ✅ Fixed: Added drop-shadow for transparent variant
    const textColor = variant === 'transparent'
        ? 'text-white/90 hover:text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
        : 'text-muted-foreground hover:text-foreground';

    const activeColor = variant === 'transparent'
        ? 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
        : 'text-foreground';

    return (
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                const hasMegaMenu = !!item.megaMenu;

                return (
                    <div
                        key={item.href}
                        className="relative"
                        onMouseEnter={() => hasMegaMenu && setActiveMenu(item.label)}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        <Link
                            href={item.href}
                            className={cn(
                                'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200',
                                isActive ? activeColor : textColor
                            )}
                            aria-haspopup={hasMegaMenu ? 'true' : undefined}
                            aria-expanded={hasMegaMenu ? activeMenu === item.label : undefined}
                        >
                            {item.label}
                            {hasMegaMenu && (
                                <ChevronDown
                                    className={cn(
                                        'h-3.5 w-3.5 transition-transform duration-200',
                                        activeMenu === item.label && 'rotate-180'
                                    )}
                                />
                            )}
                        </Link>

                        {/* ✅ Fixed: Simplified active indicator - no spring animation */}
                        {isActive && (
                            <motion.div
                                layoutId="desktop-nav-indicator"
                                className="absolute -bottom-0.5 left-3 right-3 h-0.5 bg-primary rounded-full"
                                transition={{ type: 'tween', duration: 0.2, ease: 'easeInOut' }}
                            />
                        )}

                        {/* Mega Menu */}
                        <AnimatePresence>
                            {hasMegaMenu && activeMenu === item.label && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.15, ease: 'easeInOut' }}
                                    className="absolute left-1/2 top-full z-50 mt-2 w-[600px] -translate-x-1/2"
                                >
                                    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl">
                                        <div className="grid grid-cols-3 gap-6">
                                            {item.megaMenu!.groups.map((group) => (
                                                <div key={group.title}>
                                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                        {group.title}
                                                    </h3>
                                                    <ul className="space-y-1">
                                                        {group.items.map((subItem) => (
                                                            <li key={subItem.href}>
                                                                <Link
                                                                    href={subItem.href}
                                                                    className="block rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-muted transition-colors duration-200"
                                                                >
                                                                    {subItem.label}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </nav>
    );
}