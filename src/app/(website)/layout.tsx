import { Suspense } from 'react';
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

export default async function WebsiteLayout({ children }: { children: React.ReactNode }) {
    const settings = await getBusinessSettings();
    const whatsappNumber = (settings?.whatsapp_number as string) || '';

    return (
        <>
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

            {children}

            <Footer settings={settings} />

            {whatsappNumber && <FloatingWhatsApp phoneNumber={whatsappNumber} />}
            <BackToTop />
            <CookieBanner />
        </>
    );
}