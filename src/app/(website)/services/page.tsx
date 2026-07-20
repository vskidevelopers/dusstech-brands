import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { getPublicServices, getServiceFilterOptions } from "@/features/services/queries.public";
import type { ServiceFilters } from "@/features/services/queries.public";
import { ServicesFilters } from "./_components/ServicesFilters";
import { ServiceCard } from "./_components/ServiceCard";
import { ServicesEmpty } from "./_components/ServicesEmpty";

export const metadata: Metadata = {
    title: "Branding Services | Dusstech",
    description:
        "Professional branding services including jersey branding, embroidery, DTF printing, window graphics, 3D signage, and banner printing.",
    openGraph: {
        title: "Branding Services | Dusstech",
        description: "Transform your items with our professional branding services.",
        type: "website",
    },
};

interface ServicesPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
    const params = await searchParams;

    const filters: ServiceFilters = {
        search: params.search as string | undefined,
        category: params.category as string | undefined,
        collection: params.collection as string | undefined,
        sort: (params.sort as ServiceFilters["sort"]) || "newest",
        featured: params.featured === "true" ? true : undefined,
        page: params.page ? parseInt(params.page as string) : 1,
        pageSize: 12,
    };

    const [servicesResult, filterOptions] = await Promise.all([
        getPublicServices(filters),
        getServiceFilterOptions(),
    ]);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Branding Services",
        itemListElement: servicesResult.data.map((service, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: service.name,
            url: `https://dusstech.com/services/${service.slug}`,
        })),
    };

    return (
        <div className="min-h-screen bg-background">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-28">
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-primary/10 blur-3xl animate-pulse [animation-delay:1s]" />
                </div>
                <div className="container relative mx-auto px-4">
                    <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground">Services</span>
                    </nav>
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <span className="text-sm font-medium text-primary uppercase tracking-wider">
                            What We Do
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
                        Branding Services
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                        You own the item. We bring it to life. Professional branding for jerseys,
                        signage, banners, and everything in between.
                    </p>
                </div>
            </section>

            {/* Filters + Results */}
            <section className="container mx-auto px-4 py-12">
                <ServicesFilters
                    categories={filterOptions.categories}
                    collections={filterOptions.collections}
                    currentFilters={filters}
                    totalCount={servicesResult.count}
                />

                {servicesResult.data.length === 0 ? (
                    <ServicesEmpty />
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                            {servicesResult.data.map((service) => (
                                <ServiceCard key={service.id} service={service} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {servicesResult.totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-12">
                                {Array.from({ length: servicesResult.totalPages }, (_, i) => i + 1).map(
                                    (pageNum) => (
                                        <Link
                                            key={pageNum}
                                            href={`/services?page=${pageNum}`}
                                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${pageNum === servicesResult.page
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted hover:bg-muted/80 text-foreground"
                                                }`}
                                        >
                                            {pageNum}
                                        </Link>
                                    )
                                )}
                            </div>
                        )}
                    </>
                )}
            </section>

            {/* CTA */}
            <section className="bg-primary/5 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Need Something Custom?
                    </h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Every project is unique. Start a conversation and let us bring your vision to life.
                    </p>
                    <a
                        href={getWhatsAppUrl("254700000000", "Hi, I need a custom branding solution.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Chat on WhatsApp
                    </a>
                </div>
            </section>
        </div>
    );
}

function getWhatsAppUrl(phone: string, message: string): string {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}