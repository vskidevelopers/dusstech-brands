import dynamic from 'next/dynamic';
import { getFeaturedCategories } from '@/features/categories/queries';
import { getFeaturedServices } from '@/features/services/queries';
import { getFeaturedProducts } from '@/features/products/queries';
import { Hero } from './(website)/_components/Hero';
import { BrandFlowSection } from './(website)/_components/BrandFlowSection';
import { PopularCategories } from './(website)/_components/PopularCategories';
import { FeaturedServices } from './(website)/_components/FeaturedServices';
import { FeaturedProducts } from './(website)/_components/FeaturedProducts';
import { WhyChooseDusstech } from './(website)/_components/WhyChooseDusstech';
import { getBusinessSettings } from '@/features/settings';
// import { getLatestPortfolio } from '@/features/portfolio/queries';
// import { getFeaturedTestimonials } from '@/features/testimonials/queries';


// Above-the-fold: SSR immediately

// Below-the-fold: lazy load for performance
// const PortfolioPreview = dynamic(
//   () => import('./_components/PortfolioPreview').then((m) => ({ default: m.PortfolioPreview })),
//   { ssr: true, loading: () => <PortfolioSkeleton /> }
// );

// const Testimonials = dynamic(
//   () => import('./_components/Testimonials').then((m) => ({ default: m.Testimonials })),
//   { ssr: true, loading: () => <TestimonialsSkeleton /> }
// );

const FinalCTA = dynamic(
    () => import('./(website)/_components/FinalCTA').then((m) => ({ default: m.FinalCTA })),
    { ssr: true }
);

function PortfolioSkeleton() {
    return (
        <section className="border-b border-border py-16 md:py-24">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <div className="mb-12 space-y-3 text-center">
                    <div className="mx-auto h-4 w-20 animate-pulse rounded-full bg-muted" />
                    <div className="mx-auto h-8 w-64 animate-pulse rounded bg-muted" />
                    <div className="mx-auto h-4 w-96 animate-pulse rounded bg-muted" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <div
                            key={i}
                            className="aspect-[4/5] animate-pulse rounded-2xl bg-muted"
                            style={{ aspectRatio: i % 3 === 0 ? '4/5' : i % 3 === 1 ? '1/1' : '3/4' }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function TestimonialsSkeleton() {
    return (
        <section className="border-b border-border py-16 md:py-24">
            <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
                <div className="mb-12 space-y-3 text-center">
                    <div className="mx-auto h-4 w-20 animate-pulse rounded-full bg-muted" />
                    <div className="mx-auto h-8 w-64 animate-pulse rounded bg-muted" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="h-56 animate-pulse rounded-2xl bg-muted" />
                    ))}
                </div>
            </div>
        </section>
    );
}

export const revalidate = 300; // Revalidate every 5 minutes

export default async function HomePage() {
    // Fetch all data in parallel
    const [categories, services, products, settings] = await Promise.all([
        getFeaturedCategories(6),
        getFeaturedServices(),
        getFeaturedProducts(8),
        getBusinessSettings(),
    ]);

    const whatsappNumber = (settings?.whatsapp_number as string) || '';

    return (
        <>
            {/* Above the fold — rendered immediately */}
            <Hero featuredProducts={products} />
            <BrandFlowSection />
            <PopularCategories categories={categories} />
            <FeaturedServices services={services} whatsappNumber={whatsappNumber} />
            <FeaturedProducts products={products} whatsappNumber={whatsappNumber} />
            <WhyChooseDusstech />

            {/* Below the fold — lazy loaded */}
            {/* <PortfolioPreview items={portfolio} />
      <Testimonials testimonials={testimonials} /> */}
            <FinalCTA />
        </>
    );
}