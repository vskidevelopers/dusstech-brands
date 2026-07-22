"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Eye, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PriceDisplay, calculateDiscount } from "@/components/shared/PriceDisplay";
import { BadgeGroup } from "@/components/shared/BadgeGroup";
import { WhatsAppIconButton } from "@/components/shared/WhatsAppButton";
import { getProductWhatsAppMessage } from "@/features/products/helpers";
import { useCartStore, createCartProductItem } from "@/features/cart/store";
import type { PublicProduct } from "@/features/products/queries.public";

interface ProductCardProps {
    product: PublicProduct;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isAdding, setIsAdding] = useState(false);

    // ✅ 1. Get the addItem function and current items from the store
    const addItem = useCartStore((state) => state.addItem);
    const items = useCartStore((state) => state.items);

    const discount = calculateDiscount(product.price, product.compare_at_price);

    // Check if product is already in cart to show visual feedback
    const isInCart = items.some(
        (item) => item.type === "product" && item.product_id === product.id
    );

    // ✅ 2. Updated handleAddToCart function
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdding) return;
        setIsAdding(true);

        // Small delay for button loading animation, then add to cart
        setTimeout(() => {
            const cartItem = createCartProductItem({
                id: product.id,
                name: product.name,
                price: product.price,
                compare_at_price: product.compare_at_price,
                featured_image: product.featured_image,
                slug: product.slug,
            });

            // ✅ This automatically opens the cart drawer (configured in the store)
            addItem(cartItem);

            setIsAdding(false);
        }, 300);
    };

    const whatsappMessage = getProductWhatsAppMessage(product.name, product.whatsapp_message);

    return (
        <Card className="group overflow-hidden border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            {/* Image */}
            <Link
                href={`/shop/${product.slug}`}
                className="block relative aspect-square overflow-hidden bg-muted"
            >
                {product.featured_image ? (
                    <Image
                        src={product.featured_image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <span className="text-sm">No image</span>
                    </div>
                )}

                <BadgeGroup
                    badges={{
                        featured: product.featured,
                        isNew: product.new_arrival,
                        isPopular: product.popular,
                        discountPercent: discount,
                    }}
                />

                {/* ✅ Visual feedback: Checkmark if already in cart */}
                {isInCart && (
                    <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
                        <Check className="h-4 w-4" />
                    </div>
                )}

                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Product
                    </span>
                </div>
            </Link>

            {/* Content */}
            <CardContent className="p-4 space-y-3">
                <div>
                    {product.category_name && (
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">
                            {product.category_name}
                        </span>
                    )}
                    <Link href={`/shop/${product.slug}`}>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {product.short_description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {product.short_description}
                    </p>
                )}

                <PriceDisplay
                    price={product.price}
                    compareAtPrice={product.compare_at_price}
                />

                <div className="flex gap-2 pt-1">
                    <Button
                        size="sm"
                        className="flex-1"
                        onClick={handleAddToCart}
                        disabled={isAdding || product.availability === "out_of_stock"}
                    >
                        {isAdding ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <>
                                <ShoppingCart className="h-3 w-3 mr-1" />
                                {isInCart ? "Added" : "Add"}
                            </>
                        )}
                    </Button>
                    <WhatsAppIconButton
                        phone="254722277778"
                        message={whatsappMessage}
                    />
                </div>
            </CardContent>
        </Card>
    );
}