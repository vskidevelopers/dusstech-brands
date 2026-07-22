"use client";

import { useState } from "react";
import { ShoppingCart, Zap, Tag, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay, calculateDiscount } from "@/components/shared/PriceDisplay";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { QuantitySelector } from "@/components/shared/QuantitySelector";
import { getProductWhatsAppMessage } from "@/features/products/helpers";
import { useCartStore } from "@/features/cart/store";
import { createCartProductItem } from "@/features/products/helpers";
import type { PublicProduct } from "@/features/products/queries.public";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
    product: PublicProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const router = useRouter();
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    const addItem = useCartStore((state) => state.addItem);
    const items = useCartStore((state) => state.items);
    const closeDrawer = useCartStore((state) => state.closeDrawer);

    const discount = calculateDiscount(product.price, product.compare_at_price);

    // Check if product is already in cart
    const isInCart = items.some(
        (item) => item.type === "product" && item.product_id === product.id
    );

    const handleAddToCart = () => {
        setIsAdding(true);

        const cartItem = createCartProductItem({
            id: product.id,
            name: product.name,
            price: product.price,
            compare_at_price: product.compare_at_price,
            featured_image: product.featured_image,
            slug: product.slug,
        });

        cartItem.quantity = quantity;
        addItem(cartItem); // ✅ This auto-opens the drawer!

        setIsAdding(false);
        setQuantity(1);
    };

    const handleBuyNow = () => {
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

        // Close drawer and go straight to checkout
        closeDrawer();
        router.push("/checkout");
    };

    // const handleBuyNow = () => {
    //     setIsAdding(true);

    //     setTimeout(() => {
    //         const cartItem = createCartProductItem({
    //             id: product.id,
    //             name: product.name,
    //             price: product.price,
    //             compare_at_price: product.compare_at_price,
    //             featured_image: product.featured_image,
    //             slug: product.slug,
    //         });

    //         cartItem.quantity = quantity;

    //         addItem(cartItem);

    //         toast.success("Redirecting to checkout...");

    //         // Redirect to checkout after a brief delay
    //         setTimeout(() => {
    //             router.push("/checkout");
    //         }, 500);
    //     }, 300);
    // };

    const whatsappMessage = getProductWhatsAppMessage(product.name, product.whatsapp_message);

    const availabilityBadge = {
        in_stock: { label: "In Stock", className: "bg-green-100 text-green-700" },
        low_stock: { label: "Low Stock", className: "bg-orange-100 text-orange-700" },
        out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-700" },
    }[product.availability];

    return (
        <div className="space-y-6">
            {/* Product Header */}
            <div>
                {product.category_name && (
                    <Badge variant="secondary" className="mb-3">
                        <Tag className="h-3 w-3 mr-1" />
                        {product.category_name}
                    </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
                    {product.name}
                </h1>
                <div className="flex items-center gap-4">
                    <PriceDisplay
                        price={product.price}
                        compareAtPrice={product.compare_at_price}
                        className="text-2xl"
                    />
                    {discount > 0 && (
                        <Badge className="bg-red-500 text-white">-{discount}%</Badge>
                    )}
                </div>
            </div>

            {/* Short Description */}
            {product.short_description && (
                <p className="text-lg text-muted-foreground">
                    {product.short_description}
                </p>
            )}

            {/* Availability */}
            <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <Badge className={availabilityBadge.className}>
                    {availabilityBadge.label}
                </Badge>
                {isInCart && (
                    <Badge variant="outline" className="ml-2 border-primary text-primary">
                        <Check className="h-3 w-3 mr-1" />
                        In Cart
                    </Badge>
                )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    min={1}
                    max={99}
                    size="md"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <Button
                    size="lg"
                    className="flex-1 min-w-[140px]"
                    onClick={handleAddToCart}
                    disabled={isAdding || product.availability === "out_of_stock"}
                >
                    {isAdding ? (
                        <>
                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {isInCart ? "Update Cart" : "Add to Cart"}
                        </>
                    )}
                </Button>
                <Button
                    size="lg"
                    variant="secondary"
                    className="flex-1 min-w-[140px]"
                    onClick={handleBuyNow}
                    disabled={isAdding || product.availability === "out_of_stock"}
                >
                    <Zap className="h-4 w-4 mr-2" />
                    Buy Now
                </Button>
            </div>

            {/* WhatsApp Button */}
            <WhatsAppButton
                phone="254722277778"
                message={whatsappMessage}
                className="w-full"
            >
                Inquire via WhatsApp
            </WhatsAppButton>
        </div>
    );
}