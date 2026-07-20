"use client";

import { useState } from "react";
import { ShoppingCart, Zap, Tag, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PriceDisplay, calculateDiscount } from "@/components/shared/PriceDisplay";
import { WhatsAppButton } from "@/components/shared/WhatsAppButton";
import { getProductWhatsAppMessage } from "@/features/products/helpers";
import type { PublicProduct } from "@/features/products/queries.public";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProductInfoProps {
    product: PublicProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
    console.log("Rendering ProductInfo for product:", product);
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const discount = calculateDiscount(product.selling_price, product.compare_at_price);

    const handleAddToCart = () => {
        // TODO: Integrate with cart store
        // useCartStore.getState().addProduct(product, quantity);
        toast.success(`${product.name} added to cart`);
    };

    const handleBuyNow = () => {
        // TODO: Add to cart and redirect to checkout
        // useCartStore.getState().addProduct(product, quantity);
        toast.success("Redirecting to checkout...");
        setTimeout(() => router.push("/checkout"), 500);
    };

    const whatsappMessage = getProductWhatsAppMessage(product.name, product.whatsapp_message);

    const availabilityBadge = {
        in_stock: { label: "In Stock", className: "bg-green-100 text-green-700" },
        low_stock: { label: "Low Stock", className: "bg-orange-100 text-orange-700" },
        out_of_stock: { label: "Out of Stock", className: "bg-red-100 text-red-700" },
    }[product.availability];

    return (
        <div className="space-y-6">
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
                        price={product.selling_price}
                        compareAtPrice={product.compare_at_price}
                        className="text-2xl"
                    />
                    {discount > 0 && (
                        <Badge className="bg-red-500 text-white">-{discount}%</Badge>
                    )}
                </div>
            </div>

            {product.short_description && (
                <p className="text-lg text-muted-foreground">
                    {product.short_description}
                </p>
            )}

            <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <Badge className={availabilityBadge.className}>
                    {availabilityBadge.label}
                </Badge>
            </div>

            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        -
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        +
                    </Button>
                </div>
            </div>

            <div className="flex flex-wrap gap-3">
                <Button size="lg" className="flex-1 min-w-[140px]" onClick={handleAddToCart}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                </Button>
                <Button size="lg" variant="secondary" className="flex-1 min-w-[140px]" onClick={handleBuyNow}>
                    <Zap className="h-4 w-4 mr-2" />
                    Buy Now
                </Button>
            </div>

            <WhatsAppButton phone="254700000000" message={whatsappMessage} className="w-full">
                Inquire via WhatsApp
            </WhatsAppButton>
        </div>
    );
}