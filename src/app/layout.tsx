// app/layout.tsx

import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';

import { Navbar } from '@/components/website/layout/Navbar';
import { MobileNavigation } from '@/components/website/layout/MobileNavigation';
import { Footer } from '@/components/website/layout/Footer';
import { AnnouncementBar } from '@/components/website/layout/AnnouncementBar';
import { ScrollProgress } from '@/components/website/layout/ScrollProgress';
import { BackToTop } from '@/components/website/layout/BackToTop';
import { FloatingWhatsApp } from '@/components/website/layout/FloatingWhatsApp';
import { CookieBanner } from '@/components/website/layout/CookieBanner';
import { SearchOverlay } from '@/components/website/layout/SearchOverlay';
import { CartDrawer } from '@/components/website/layout/CartDrawer';

import { getBusinessSettings } from '@/features/settings/service';

export const metadata: Metadata = {
    title: {
        default: 'Your Business Name',
        template: '%s | Your Business Name',
    },
    description: 'Your business description',
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const settings = await getBusinessSettings();
    const whatsappNumber =
        (settings?.whatsapp_number as string) || '';

    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <ScrollProgress />

                <AnnouncementBar />

                <Navbar />

                <MobileNavigation />

                <Suspense fallback={null}>
                    <SearchOverlay />
                </Suspense>

                <Suspense fallback={null}>
                    <CartDrawer />
                </Suspense>

                <main>{children}</main>

                <Footer settings={settings} />

                {whatsappNumber && (
                    <FloatingWhatsApp phoneNumber={whatsappNumber} />
                )}

                <BackToTop />

                <CookieBanner />
            </body>
        </html>
    );
}