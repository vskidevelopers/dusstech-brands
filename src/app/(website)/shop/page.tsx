import type { Metadata } from "next";
import Link from "next/link";
import { getPublicProducts, getProductFilterOptions } from "@/features/products/queries.public";
import type { ProductFilters } from "@/features/products/queries.public";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { EmptyState } from "@/components/shared/EmptyState";
import { Pagination } from "@/components/shared/ShopPagination";
import { ShopFilters } from "../_components/ShopFilters";
import { ProductCard } from "../_components/ProductCard";

export const metadata: Metadata = {
    title: "Shop Branded Products | Dusstech",
    description:
        "Shop premium branded products including jerseys, hoodies, mugs, bottles, and gift sets. Supplied and branded by Dusstech.",
    openGraph: {
        title: "Shop Branded Products | Dusstech",
        description: "Premium branded products supplied by Dusstech.",
        type: "website",
    },
};

interface ShopPageProps {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
    const params = await searchParams;

    const filters: ProductFilters = {
        search: params.search as string | undefined,
        category: params.category as string | undefined,
        collection: params.collection as string | undefined,
        sort: (params.sort as ProductFilters["sort"]) || "newest",
        featured: params.featured === "true" ? true : undefined,
        new_arrival: params.new_arrival === "true" ? true : undefined,
        popular: params.popular === "true" ? true : undefined,
        price_min: params.price_min ? parseInt(params.price_min as string) : undefined,
        price_max: params.price_max ? parseInt(params.price_max as string) : undefined,
        page: params.page ? parseInt(params.page as string) : 1,
        pageSize: 16,
    };

    const [productsResult, filterOptions] = await Promise.all([
        getPublicProducts(filters),
        getProductFilterOptions(),
    ]);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Branded Products",
        itemListElement: productsResult.data.map((product, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: product.name,
            url: `https://dusstech.com/shop/${product.slug}`,
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
                    <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
                        Shop Branded Products
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                        Premium products supplied and branded by Dusstech. From jerseys to gift sets,
                        we deliver quality you can feel.
                    </p>
                </div>
            </section>

            {/* Filters + Results */}
            <section className="container mx-auto px-4 py-12">
                <ShopFilters
                    categories={filterOptions.categories}
                    collections={filterOptions.collections}
                    currentFilters={filters}
                    totalCount={productsResult.count}
                />

                {productsResult.data.length === 0 ? (
                    <EmptyState clearFiltersHref="/shop" showBackHome />
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
                            {productsResult.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <Pagination
                            currentPage={productsResult.page}
                            totalPages={productsResult.totalPages}
                            baseUrl="/shop"
                        />
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
                        Explore our branding services to personalize your own items.
                    </p>
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Explore Branding Services
                    </Link>
                </div>
            </section>
        </div>
    );
}