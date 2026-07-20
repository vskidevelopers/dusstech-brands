'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MessageCircle, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/website/ui/Button';
import { Container } from '@/components/website/ui/Container';
import { SectionHeader } from '@/components/website/layout/SectionHeader';
import { StaggerContainer, StaggerItem } from '@/components/website/motion';
import { useCartStore } from '../../../store/useCartStore';
import { toast } from 'sonner';
import type { Service } from '@/features/services/types';

interface FeaturedServicesProps {
    services: Service[];
    whatsappNumber?: string;
}

export function FeaturedServices({ services, whatsappNumber }: FeaturedServicesProps) {
    const addItem = useCartStore((s) => s.addItem);
    const openCart = useCartStore((s) => s.openCart);

    if (services.length === 0) return null;

    const handleAddToCart = (service: Service) => {
        addItem({
            id: service.id,
            type: 'service',
            name: service.name,
            slug: service.slug,
            price: service.starting_price || 0,
            image: service.featured_image || undefined,
        });
        toast.success(`${service.name} added to cart`);
        openCart();
    };

    const handleWhatsApp = (service: Service) => {
        if (!whatsappNumber) return;
        const message = `Hi Dusstech! I'm interested in your "${service.name}" service.`;
        const href = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(href, '_blank');
    };

    return (
        <section className="border-b border-border bg-gradient-to-b from-background to-canvas py-16 md:py-24">
            <Container size="xl">
                <SectionHeader
                    eyebrow="Our Expertise"
                    title="Featured Services"
                    description="Premium branding solutions crafted by our team of experts."
                />

                <StaggerContainer staggerDelay={0.08} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <StaggerItem key={service.id}>
                            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                {/* Image */}
                                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                                    {service.featured_image ? (
                                        <Image
                                            src={service.featured_image}
                                            alt={service.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                            <span className="text-5xl font-bold text-primary/20">
                                                {service.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-5">
                                    <h3 className="text-lg font-semibold tracking-tight">
                                        <Link
                                            href={`/services/${service.slug}`}
                                            className="hover:text-primary transition-colors"
                                        >
                                            {service.name}
                                        </Link>
                                    </h3>
                                    {service.short_description && (
                                        <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-2">
                                            {service.short_description}
                                        </p>
                                    )}

                                    {service.starting_price != null && (
                                        <div className="mt-4 flex items-baseline gap-1.5">
                                            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                                From
                                            </span>
                                            <span className="text-lg font-bold text-foreground">
                                                KES {service.starting_price.toLocaleString()}
                                            </span>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
                                        <Button size="sm" variant="outline" className="flex-1" asChild>
                                            <Link href={`/services/${service.slug}`}>
                                                View <ArrowRight className="ml-1 h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleAddToCart(service)}
                                            aria-label={`Add ${service.name} to cart`}
                                        >
                                            <ShoppingBag className="h-3.5 w-3.5" />
                                        </Button>
                                        {whatsappNumber && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleWhatsApp(service)}
                                                aria-label={`WhatsApp about ${service.name}`}
                                            >
                                                <MessageCircle className="h-3.5 w-3.5" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

                <div className="mt-10 text-center">
                    <Button variant="outline" size="lg" asChild>
                        <Link href="/services">
                            View All Services <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
}