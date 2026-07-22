"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, ShoppingBag, ArrowRight, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { QuantitySelector } from "./QuantitySelector";
import { useCartStore, type CartItem, type CartProductItem } from "@/features/cart/store";
import { cn } from "@/lib/utils";

export function CartDrawer() {
    const router = useRouter();
    const drawerRef = useRef<HTMLDivElement>(null);

    const isOpen = useCartStore((state) => state.isDrawerOpen);
    const closeDrawer = useCartStore((state) => state.closeDrawer);
    const items = useCartStore((state) => state.items);
    const lastAddedItem = useCartStore((state) => state.lastAddedItem);
    const subtotal = useCartStore((state) => state.getSubtotal());
    const totalItems = useCartStore((state) => state.getTotalItems());
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);

    // Close on Escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeDrawer();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, closeDrawer]);

    // Close on backdrop click
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) closeDrawer();
    };

    const handleCheckout = () => {
        closeDrawer();
        router.push("/checkout");
    };

    const handleViewCart = () => {
        closeDrawer();
        router.push("/cart");
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={handleBackdropClick}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping Cart"
                className={cn(
                    "fixed top-0 right-0 z-[101] h-full w-full max-w-md bg-background shadow-2xl transition-transform duration-300 ease-out flex flex-col",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        <h2 className="text-lg font-semibold">
                            Your Cart
                            {totalItems > 0 && (
                                <span className="ml-2 text-sm font-normal text-muted-foreground">
                                    ({totalItems} {totalItems === 1 ? "item" : "items"})
                                </span>
                            )}
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeDrawer}
                        className="h-9 w-9"
                        aria-label="Close cart"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Just Added Confirmation */}
                {lastAddedItem && isOpen && (
                    <div className="mx-6 mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 animate-in slide-in-from-top-2 fade-in duration-300">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    Added to cart
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300 truncate">
                                    {lastAddedItem.name}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <div className="rounded-full bg-muted p-4 mb-4">
                                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <p className="font-medium mb-1">Your cart is empty</p>
                            <p className="text-sm text-muted-foreground mb-6">
                                Start adding products or services to get going.
                            </p>
                            <Button variant="outline" onClick={closeDrawer} asChild>
                                <Link href="/shop">Continue Shopping</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <DrawerCartItem
                                    key={item.type === "product" ? item.product_id : item.service_id}
                                    item={item}
                                    onRemove={() =>
                                        removeItem(
                                            item.type === "product" ? item.product_id : item.service_id,
                                            item.type
                                        )
                                    }
                                    onQuantityChange={(qty) =>
                                        updateQuantity(
                                            item.type === "product" ? item.product_id : item.service_id,
                                            item.type,
                                            qty
                                        )
                                    }
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="border-t px-6 py-4 space-y-4 bg-muted/30">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Subtotal</span>
                            <span className="text-lg font-bold">
                                KES {subtotal.toLocaleString()}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Delivery calculated after order confirmation.
                        </p>

                        {/* Actions */}
                        <div className="space-y-2">
                            <Button className="w-full" size="lg" onClick={handleCheckout}>
                                Proceed to Checkout
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <Button variant="outline" className="w-full" onClick={handleViewCart}>
                                View Full Cart
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-muted-foreground"
                                onClick={closeDrawer}
                            >
                                Continue Shopping
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

/* ---------- Drawer Cart Item ---------- */

function DrawerCartItem({
    item,
    onRemove,
    onQuantityChange,
}: {
    item: CartItem;
    onRemove: () => void;
    onQuantityChange: (qty: number) => void;
}) {
    return (
        <div className="flex gap-3 animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Image */}
            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden bg-muted border">
                {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{item.type}</p>
                    </div>
                    <button
                        onClick={onRemove}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        aria-label={`Remove ${item.name}`}
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                    </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <QuantitySelector
                        quantity={item.quantity}
                        onQuantityChange={onQuantityChange}
                        size="sm"
                    />
                    <span className="text-sm font-semibold">
                        KES {(item.price * item.quantity).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}