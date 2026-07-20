/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Package, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QuantitySelector } from "./QuantitySelector";
import type { CartItem as CartItemType } from "@/features/cart/store";

interface CartItemProps {
    item: CartItemType;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
}

export function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
    const subtotal = item.price * item.quantity;

    return (
        <div className="flex gap-4 p-4 border rounded-lg bg-card transition-all hover:shadow-sm">
            {/* Image */}
            <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                {item.image ? (
                    <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        {item.type === "product" ? (
                            <Package className="h-8 w-8" />
                        ) : (
                            <Wrench className="h-8 w-8" />
                        )}
                    </div>
                )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                        <Link
                            href={item.type === "product" ? `/shop/${(item as any).slug}` : `/services/${(item as any).slug}`}
                            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                            {item.name}
                        </Link>
                        <Badge variant="secondary" className="mt-1 text-xs">
                            {item.type === "product" ? "Product" : "Service"}
                        </Badge>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={onRemove}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                    <QuantitySelector quantity={item.quantity} onQuantityChange={onQuantityChange} size="sm" />
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                            KES {item.price.toLocaleString()} × {item.quantity}
                        </p>
                        <p className="text-lg font-bold text-foreground">
                            KES {subtotal.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}