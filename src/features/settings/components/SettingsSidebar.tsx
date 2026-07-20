'use client';

import {
    Building2, Palette, Phone, MapPin, Clock, Share2, Search,
    FileText, Package, CreditCard, Settings as SettingsIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface Section {
    id: string;
    label: string;
    icon: LucideIcon;
}

const sections: Section[] = [
    { id: 'general', label: 'General', icon: Building2 },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'location', label: 'Location', icon: MapPin },
    { id: 'hours', label: 'Business Hours', icon: Clock },
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'seo', label: 'Website SEO', icon: Search },
    { id: 'quotations', label: 'Quotation Defaults', icon: FileText },
    { id: 'orders', label: 'Order Defaults', icon: Package },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'system', label: 'System', icon: SettingsIcon },
];

export function SettingsSidebar() {
    const handleClick = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="hidden lg:block lg:w-56 lg:shrink-0">
            <div className="sticky top-20 space-y-1">
                {sections.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => handleClick(id)}
                        className={cn(
                            'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                            'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )}
                    >
                        <Icon className="h-4 w-4" />
                        {label}
                    </button>
                ))}
            </div>
        </nav>
    );
}