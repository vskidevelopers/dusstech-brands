"use client";

import { useState } from "react";
import { ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PublicProduct } from "@/features/products/queries.public";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StickyMobileCTAProps {
    product: PublicProduct;
}

export function StickyMobileCTA({ product }: StickyMobileCTAProps) {
    const [quantity, setQuantity] = useState(1);
    const router = useRouter();

    const handleAddToCart = () => {
        // TODO: Integrate with cart store
        toast.success(`${product.name} added to cart`);
    };

    const handleBuyNow = () => {
        // TODO: Add to cart and redirect
        toast.success("Redirecting to checkout...");
        setTimeout(() => router.push("/checkout"), 500);
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                        -
                    </Button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQuantity(quantity + 1)}
                    >
                        +
                    </Button>
                </div>
                <div className="flex gap-2 flex-1">
                    <Button size="sm" className="flex-1" onClick={handleAddToCart}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                    </Button>
                    <Button size="sm" variant="secondary" className="flex-1" onClick={handleBuyNow}>
                        <Zap className="h-4 w-4 mr-1" />
                        Buy
                    </Button>
                </div>
            </div>
        </div>
    );
}