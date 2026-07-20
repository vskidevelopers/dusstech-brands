/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, ArrowUpRight } from 'lucide-react';
import { Container } from '../ui/Container';
import { Divider } from '../ui/Divider';
import { NewsletterCTA } from './NewsletterCTA';
import type { Settings } from '@/features/settings/types';
import { formatFullAddress } from '@/features/settings/utils';
import { DAY_LABELS, type BusinessHours, type DayOfWeek } from '@/features/settings/types';

interface FooterProps {
    settings: Settings | null;
}

const FOOTER_NAV = {
    services: [
        { label: 'Logo Design', href: '/services/logo-design' },
        { label: 'Brand Identity', href: '/services/brand-identity' },
        { label: 'Print & Signage', href: '/services/print-signage' },
        { label: 'Vehicle Branding', href: '/services/vehicle-branding' },
    ],
    shop: [
        { label: 'Apparel', href: '/shop/apparel' },
        { label: 'Corporate Gifts', href: '/shop/corporate' },
        { label: 'New Arrivals', href: '/shop/new-arrivals' },
        { label: 'Best Sellers', href: '/shop/best-sellers' },
    ],
    company: [
        { label: 'About', href: '/about' },
        { label: 'Portfolio', href: '/portfolio' },
        { label: 'Contact', href: '/contact' },
        { label: 'Blog', href: '/blog' },
    ],
};

function formatHours(hours: BusinessHours | null): string[] {
    if (!hours) return [];
    const lines: string[] = [];
    const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for (const day of days) {
        const schedule = hours[day];
        if (schedule.isOpen) {
            lines.push(`${DAY_LABELS[day].slice(0, 3)}: ${schedule.open} - ${schedule.close}`);
        }
    }
    return lines.slice(0, 5); // Show first 5 days
}

export function Footer({ settings }: FooterProps) {
    const businessName = (settings?.business_name as string) || 'Dusstech Brands';
    const tagline = (settings?.tagline as string) || 'Own Your Brand';
    const address = formatFullAddress(settings as any);
    const phone = (settings?.phone_primary as string) || '';
    const email = (settings?.email as string) || '';
    const whatsapp = (settings?.whatsapp_number as string) || '';
    const mapsUrl = (settings?.google_maps_url as string) || '';
    const hours = formatHours(settings?.business_hours as BusinessHours | null);

    const socials = [
        { label: 'Facebook', href: settings?.facebook as string, icon: 'f' },
        { label: 'Instagram', href: settings?.instagram as string, icon: 'ig' },
        { label: 'LinkedIn', href: settings?.linkedin as string, icon: 'in' },
        { label: 'TikTok', href: settings?.tiktok as string, icon: 'tt' },
        { label: 'X', href: settings?.x as string, icon: 'x' },
    ].filter((s) => s.href);

    return (
        <footer className="bg-canvas border-t border-border">
            <Container size="xl" className="py-16 md:py-20">
                {/* Top: Newsletter */}
                <div className="mb-16 max-w-2xl">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                        Stay in the loop
                    </h2>
                    <p className="text-muted-foreground mb-6">
                        Get branding tips, new product drops, and exclusive offers.
                    </p>
                    <NewsletterCTA variant="compact" />
                </div>

                {/* Main Grid */}
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="inline-block text-xl font-bold tracking-tight">
                            <span className="text-primary">Dusstech</span> Brands
                        </Link>
                        <p className="mt-3 text-sm italic text-muted-foreground">&quot;{tagline}&quot;</p>

                        <ul className="mt-6 space-y-3 text-sm">
                            {address && (
                                <li className="flex items-start gap-2.5">
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                                    {mapsUrl ? (
                                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                            {address}
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground">{address}</span>
                                    )}
                                </li>
                            )}
                            {phone && (
                                <li className="flex items-center gap-2.5">
                                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <a href={`tel:${phone}`} className="text-muted-foreground hover:text-foreground transition-colors">
                                        {phone}
                                    </a>
                                </li>
                            )}
                            {email && (
                                <li className="flex items-center gap-2.5">
                                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    <a href={`mailto:${email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                                        {email}
                                    </a>
                                </li>
                            )}
                        </ul>

                        {/* Social */}
                        {socials.length > 0 && (
                            <div className="mt-6 flex gap-2">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={s.label}
                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                                    >
                                        {s.icon.toUpperCase()}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Services</h3>
                        <ul className="space-y-2.5">
                            {FOOTER_NAV.services.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Shop */}
                    <div>
                        <h3 className="text-sm font-semibold mb-4">Shop</h3>
                        <ul className="space-y-2.5">
                            {FOOTER_NAV.shop.map((item) => (
                                <li key={item.href}>
                                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-4">
                            <Clock className="h-4 w-4" />
                            Business Hours
                        </h3>
                        {hours.length > 0 ? (
                            <ul className="space-y-1.5 text-sm text-muted-foreground">
                                {hours.map((line, i) => (
                                    <li key={i} className="font-mono text-xs">{line}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">Mon - Fri: 8am - 5pm</p>
                        )}
                        {whatsapp && (
                            <a
                                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                            >
                                Chat on WhatsApp <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                        )}
                    </div>
                </div>

                <Divider className="my-10" />

                {/* Bottom */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} {businessName}. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </Container>
        </footer>
    );
}