'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, MessageCircle, Eye } from 'lucide-react';
import { Button } from '@/components/website/ui/Button';
import { Badge } from '@/components/website/ui/Badge';
import { Container } from '@/components/website/ui/Container';
import { SectionHeader } from '@/components/website/layout/SectionHeader';
import { StaggerContainer, StaggerItem } from '@/components/website/motion';
import { useCartStore } from '@/store/useCartStore';
import { toast } from 'sonner';
import type { Product } from '@/features/products/types';

interface FeaturedProductsProps {
    products: Product[];
    whatsappNumber?: string;
}

export function FeaturedProducts({ products, whatsappNumber }: FeaturedProductsProps) {
    const addItem = useCartStore((s) => s.addItem);
    const openCart = useCartStore((s) => s.openCart);

    if (products.length === 0) return null;

    const handleAddToCart = (product: Product) => {
        addItem({
            id: product.id,
            type: 'product',
            name: product.name,
            slug: product.slug,
            price: product.selling_price,
            image: product.featured_image || undefined,
        });
        toast.success(`${product.name} added to cart`);
        openCart();
    };

    const handleWhatsApp = (product: Product) => {
        if (!whatsappNumber) return;
        const message = product.whatsapp_message || `Hi Dusstech! I'm interested in "${product.name}".`;
        const href = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(href, '_blank');
    };

    return (
        <section className="border-b border-border py-16 md:py-24">
            <Container size="xl">
                <SectionHeader
                    eyebrow="Shop"
                    title="Featured Products"
                    description="Ready-to-brand products, crafted for quality and impact."
                />

                <StaggerContainer staggerDelay={0.06} className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                        <StaggerItem key={product.id}>
                            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden bg-muted">
                                    {product.featured_image ? (
                                        <Image
                                            src={product.featured_image}
                                            alt={product.name}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                                            <span className="text-4xl font-bold text-primary/20">
                                                {product.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute left-2 top-2 flex flex-col gap-1">
                                        {product.new_arrival && (
                                            <Badge variant="default" size="sm">New</Badge>
                                        )}
                                        {product.popular && (
                                            <Badge variant="accent" size="sm">Popular</Badge>
                                        )}
                                    </div>

                                    {/* Quick view on hover */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100">
                                        <Link
                                            href={`/shop/${product.slug}`}
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-foreground shadow-lg transition-transform hover:scale-110"
                                            aria-label={`View ${product.name}`}
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex flex-1 flex-col p-4">
                                    <Link
                                        href={`/shop/${product.slug}`}
                                        className="text-sm font-semibold tracking-tight line-clamp-2 hover:text-primary transition-colors"
                                    >
                                        {product.name}
                                    </Link>

                                    <div className="mt-2 flex items-baseline gap-2">
                                        <span className="text-base font-bold text-foreground">
                                            KES {product.selling_price.toLocaleString()}
                                        </span>
                                        {product.compare_at_price && product.compare_at_price > product.selling_price && (
                                            <span className="text-xs text-muted-foreground line-through">
                                                KES {product.compare_at_price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-3 flex items-center gap-1.5">
                                        <Button
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => handleAddToCart(product)}
                                        >
                                            <ShoppingBag className="h-3.5 w-3.5" />
                                            Add
                                        </Button>
                                        {whatsappNumber && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleWhatsApp(product)}
                                                aria-label={`WhatsApp about ${product.name}`}
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
                        <Link href="/shop">
                            View All Products <ShoppingBag className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </Container>
        </section>
    );
}