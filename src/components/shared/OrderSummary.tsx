"use client";

import { useCartStore } from "@/features/cart/store";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, Wrench } from "lucide-react";
import Link from "next/link";

interface OrderSummaryProps {
    onCheckout?: () => void;
    showCheckoutButton?: boolean;
}

export function OrderSummary({ onCheckout, showCheckoutButton = true }: OrderSummaryProps) {
    const items = useCartStore((state) => state.items);
    const subtotal = useCartStore((state) => state.getSubtotal());
    const totalItems = useCartStore((state) => state.getTotalItems());

    const products = items.filter((item) => item.type === "product");
    const services = items.filter((item) => item.type === "service");

    return (
        <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="text-lg font-semibold">Order Summary</h3>

            {/* Itemized List */}
            <div className="space-y-4 max-h-80 overflow-y-auto">
                {/* Products */}
                {products.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Package className="h-4 w-4" />
                            <span>Products ({products.reduce((sum, p) => sum + p.quantity, 0)})</span>
                        </div>
                        <div className="space-y-2 pl-6">
                            {products.map((product) => (
                                <div key={product.product_id} className="flex justify-between text-sm">
                                    <span className="text-foreground truncate flex-1 mr-2">
                                        {product.name}
                                        {product.quantity > 1 && (
                                            <span className="text-muted-foreground ml-1">×{product.quantity}</span>
                                        )}
                                    </span>
                                    <span className="font-medium whitespace-nowrap">
                                        KES {(product.price * product.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Services */}
                {services.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Wrench className="h-4 w-4" />
                            <span>Services ({services.reduce((sum, s) => sum + s.quantity, 0)})</span>
                        </div>
                        <div className="space-y-2 pl-6">
                            {services.map((service) => (
                                <div key={service.service_id} className="flex justify-between text-sm">
                                    <span className="text-foreground truncate flex-1 mr-2">
                                        {service.name}
                                        {service.quantity > 1 && (
                                            <span className="text-muted-foreground ml-1">×{service.quantity}</span>
                                        )}
                                    </span>
                                    <span className="font-medium whitespace-nowrap">
                                        KES {(service.price * service.quantity).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium">KES {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-xs text-muted-foreground italic">
                        Calculated after confirmation
                    </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                    <span>Grand Total</span>
                    <span className="text-primary">KES {subtotal.toLocaleString()}</span>
                </div>
            </div>

            {showCheckoutButton && (
                <div className="space-y-2 pt-2">
                    <Button className="w-full" size="lg" onClick={onCheckout}>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Proceed to Checkout
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/shop">Continue Shopping</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}