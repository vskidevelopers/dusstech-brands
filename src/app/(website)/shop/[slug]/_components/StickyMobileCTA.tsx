"use client";

import { useState } from "react";
import { ShoppingCart, Zap, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { useCartStore } from "@/features/cart/store";
import { createCartProductItem } from "@/features/products/helpers";
import type { PublicProduct } from "@/features/products/queries.public";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StickyMobileCTAProps {
    product: PublicProduct;
}

export function StickyMobileCTA({ product }: StickyMobileCTAProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        if (isAdding) return;

        setIsAdding(true);

        setTimeout(() => {
            const cartItem = createCartProductItem({
                id: product.id,
                name: product.name,
                price: product.price,
                compare_at_price: product.compare_at_price,
                featured_image: product.featured_image,
                slug: product.slug,
            });

            cartItem.quantity = quantity;
            addItem(cartItem);

            toast.success(
                <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Added to cart</span>
                </div>
            );

            setIsAdding(false);
            setQuantity(1);
        }, 300);
    };

    const handleBuyNow = () => {
        if (isAdding) return;

        setIsAdding(true);

        setTimeout(() => {
            const cartItem = createCartProductItem({
                id: product.id,
                name: product.name,
                price: product.price,
                compare_at_price: product.compare_at_price,
                featured_image: product.featured_image,
                slug: product.slug,
            });

            cartItem.quantity = quantity;
            addItem(cartItem);

            toast.success("Redirecting to checkout...");

            setTimeout(() => {
                router.push("/checkout");
            }, 500);
        }, 300);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t p-4 shadow-lg">
            <div className="flex items-center justify-between gap-3">
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    size="sm"
                />
                <div className="flex gap-2 flex-1">
                    <Button
                        size="sm"
                        className="flex-1"
                        onClick={handleAddToCart}
                        disabled={isAdding || product.availability === "out_of_stock"}
                    >
                        {isAdding ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                            <>
                                <ShoppingCart className="h-4 w-4 mr-1" />
                                Add
                            </>
                        )}
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="flex-1"
                        onClick={handleBuyNow}
                        disabled={isAdding || product.availability === "out_of_stock"}
                    >
                        <Zap className="h-4 w-4 mr-1" />
                        Buy
                    </Button>
                </div>
            </div>
        </div>
    );
}