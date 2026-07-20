import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicServiceBySlug, getRelatedServices } from "@/features/services/queries.public";
import { formatPrice, getServiceWhatsAppMessage, getWhatsAppUrl } from "@/features/services/helpers";
import { ServiceGallery } from "./_components/ServiceGallery";
import { StickyMobileCTA } from "./_components/StickyMobileCTA";
import { ServiceCard } from "../_components/ServiceCard";

interface ServiceDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const service = await getPublicServiceBySlug(slug);

    if (!service) {
        return { title: "Service Not Found | Dusstech" };
    }

    const title = service.seo_title || `${service.name} | Dusstech`;
    const description = service.seo_description || service.short_description || "";

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            images: service.featured_image ? [{ url: service.featured_image }] : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: service.featured_image ? [service.featured_image] : [],
        },
        alternates: {
            canonical: `https://dusstech.com/services/${slug}`,
        },
    };
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
    const { slug } = await params;
    const service = await getPublicServiceBySlug(slug);

    if (!service) notFound();

    const relatedServices = await getRelatedServices(
        service.id,
        service.category_id,
        service.collection_ids
    );

    const whatsappUrl = getWhatsAppUrl(
        "254700000000",
        getServiceWhatsAppMessage(service.name, service.whatsapp_message)
    );

    const allImages = [
        ...(service.featured_image ? [service.featured_image] : []),
        ...(service.gallery || []).filter((img) => img !== service.featured_image),
    ];

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name,
        description: service.short_description,
        image: service.featured_image,
        offers: {
            "@type": "Offer",
            price: service.starting_price,
            priceCurrency: "KES",
        },
    };

    return (
        <div className="min-h-screen bg-background pb-24 md:pb-0">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/services" className="hover:text-foreground transition-colors">Services</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-foreground">{service.name}</span>
                </nav>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Gallery */}
                    <ServiceGallery images={allImages} alt={service.name} />

                    {/* Info */}
                    <div className="space-y-6">
                        {/* Hero Info */}
                        <div>
                            {service.category_name && (
                                <Badge variant="secondary" className="mb-3">
                                    <Tag className="h-3 w-3 mr-1" />
                                    {service.category_name}
                                </Badge>
                            )}
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                                {service.name}
                            </h1>
                            <p className="text-2xl font-bold text-primary">
                                {formatPrice(service.starting_price ?? 0, service.pricing_type)}
                            </p>
                        </div>

                        {service.short_description && (
                            <p className="text-lg text-muted-foreground">
                                {service.short_description}
                            </p>
                        )}

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3">
                            <Button size="lg" className="flex-1 min-w-[140px]">
                                Add Service
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                                    <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp
                                </a>
                            </Button>
                        </div>

                        {/* Branding Notes */}
                        {service.branding_notes && (
                            <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                                <h3 className="font-semibold text-foreground mb-2">Branding Notes</h3>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                    {service.branding_notes}
                                </p>
                            </div>
                        )}

                        {/* Details */}
                        <div className="rounded-lg border p-6 space-y-3">
                            <h3 className="font-semibold text-foreground">Service Details</h3>
                            {service.category_name && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Category</span>
                                    <span className="font-medium">{service.category_name}</span>
                                </div>
                            )}
                            {service.turnaround_time && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> Turnaround
                                    </span>
                                    <span className="font-medium">{service.turnaround_time}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Pricing</span>
                                <span className="font-medium capitalize">
                                    {service.pricing_type.replace("_", " ")}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        {service.description && (
                            <div>
                                <h3 className="font-semibold text-foreground mb-3">About This Service</h3>
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground"
                                    dangerouslySetInnerHTML={{ __html: service.description }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Services */}
                {relatedServices.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-2xl font-bold mb-8">Related Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedServices.map((related) => (
                                <ServiceCard key={related.id} service={related} />
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Sticky Mobile CTA */}
            <StickyMobileCTA
                name={service.name}
                price={formatPrice(service.starting_price ?? 0, service.pricing_type)}
                whatsappUrl={whatsappUrl}
            />
        </div>
    );
}