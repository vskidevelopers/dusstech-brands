import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicProductBySlug, getRelatedProducts } from "@/features/products/queries.public";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { ProductGallery } from "./_components/ProductGallery";
import { ProductInfo } from "./_components/ProductInfo";
import { SpecificationsTable } from "./_components/SpecificationsTable";
import { RecentlyViewed } from "./_components/RecentlyViewed";
import { ProductCard } from "../_components/ProductCard";
import { StickyMobileCTA } from "./_components/StickyMobileCTA";

interface ProductDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const product = await getPublicProductBySlug(slug);

    if (!product) {
        return { title: "Product Not Found | Dusstech" };
    }

    const title = product.seo_title || `${product.name} | Dusstech`;
    const description = product.seo_description || product.short_description || "";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "website",
            images: product.featured_image ? [product.featured_image] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: product.featured_image ? [product.featured_image] : [],
        },
        alternates: {
            canonical: `https://dusstech.com/shop/${slug}`,
        },
    };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { slug } = await params;
    const product = await getPublicProductBySlug(slug);
    console.log("Product detail page for slug:", slug, "Product:", product);

    if (!product) notFound();

    const relatedProducts = await getRelatedProducts(
        product.id,
        product.category_id,
        product.collection_ids
    );

    const allImages = [
        ...(product.featured_image ? [product.featured_image] : []),
        ...(product.gallery || []).filter((img) => img !== product.featured_image),
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.short_description,
        image: product.featured_image,

        offers: {
            "@type": "Offer",
            price: product.selling_price || product.selling_price,
            priceCurrency: "KES",
            availability: product.availability === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
    };

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-0">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs
                    items={[
                        { label: "Home", href: "/" },
                        { label: "Shop", href: "/shop" },
                        { label: product.name },
                    ]}
                />

                <div className="grid gap-12 lg:grid-cols-2">
                    <ProductGallery images={allImages} alt={product.name} />
                    <ProductInfo product={product} />
                </div>

                {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold mb-6">Specifications</h2>
                        <SpecificationsTable specifications={product.specifications} />
                    </section>
                )}

                {product.branding_notes && (
                    <section className="mt-12">
                        <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                            <h3 className="font-semibold text-foreground mb-2">Branding Notes</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {product.branding_notes}
                            </p>
                        </div>
                    </section>
                )}

                {product.description && (
                    <section className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Description</h2>
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </section>
                )}

                {relatedProducts.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-bold mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((related) => (
                                <ProductCard key={related.id} product={related} />
                            ))}
                        </div>
                    </section>
                )}

                <RecentlyViewed currentProductId={product.id} />
            </div>

            <StickyMobileCTA product={product} />
        </div>
    );
}