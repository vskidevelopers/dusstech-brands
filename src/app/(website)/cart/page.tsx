"use client";

import Link from "next/link";
import { ShoppingBag, Wrench, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { CartItem } from "@/components/shared/CartItem";
import { OrderSummary } from "@/components/shared/OrderSummary";
import { useCartStore } from "@/features/cart/store";
import { useRouter } from "next/navigation";

export default function CartPage() {
    const router = useRouter();
    const items = useCartStore((state) => state.items);
    const updateQuantity = useCartStore((state) => state.updateQuantity);
    const removeItem = useCartStore((state) => state.removeItem);

    const products = items.filter((item) => item.type === "product");
    const services = items.filter((item) => item.type === "service");

    if (items.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="rounded-full bg-muted p-6 mb-6">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-bold mb-3">Your branding journey starts here</h1>
                <p className="text-muted-foreground mb-8 max-w-md">
                    Your cart is empty. Explore our services and products to get started.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Button asChild>
                        <Link href="/services">
                            <Wrench className="h-4 w-4 mr-2" />
                            Explore Services
                        </Link>
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href="/shop">
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Visit Shop
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />

                <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {products.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5" />
                                    Products ({products.length})
                                </h2>
                                <div className="space-y-3">
                                    {products.map((item) => (
                                        <CartItem
                                            key={item.product_id}
                                            item={item}
                                            onQuantityChange={(qty) =>
                                                updateQuantity(item.product_id, "product", qty)
                                            }
                                            onRemove={() => removeItem(item.product_id, "product")}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {services.length > 0 && (
                            <div>
                                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                    <Wrench className="h-5 w-5" />
                                    Services ({services.length})
                                </h2>
                                <div className="space-y-3">
                                    {services.map((item) => (
                                        <CartItem
                                            key={item.service_id}
                                            item={item}
                                            onQuantityChange={(qty) =>
                                                updateQuantity(item.service_id, "service", qty)
                                            }
                                            onRemove={() => removeItem(item.service_id, "service")}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:sticky lg:top-24 h-fit">
                        <OrderSummary onCheckout={() => router.push("/checkout")} />
                    </div>
                </div>
            </div>
        </div>
    );
}