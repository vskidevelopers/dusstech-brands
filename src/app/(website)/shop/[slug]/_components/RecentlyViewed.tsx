/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

interface RecentlyViewedProps {
    currentProductId: string;
}

interface ViewedProduct {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    price: number;
}

export function RecentlyViewed({ currentProductId }: RecentlyViewedProps) {
    const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem("recentlyViewed");
        if (stored) {
            const products: ViewedProduct[] = JSON.parse(stored);
            setViewedProducts(products.filter((p) => p.id !== currentProductId).slice(0, 6));
        }
    }, [currentProductId]);

    if (viewedProducts.length === 0) return null;

    return (
        <section className="mt-20">
            <h2 className="text-2xl font-bold mb-8">Recently Viewed</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {viewedProducts.map((product) => (
                    <Link key={product.id} href={`/shop/${product.slug}`}>
                        <Card className="group overflow-hidden border bg-card transition-all hover:shadow-md">
                            <div className="relative aspect-square overflow-hidden bg-muted">
                                {product.image && (
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        sizes="150px"
                                    />
                                )}
                            </div>
                            <CardContent className="p-3">
                                <h3 className="text-sm font-medium line-clamp-1">{product.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                    KES {product.price.toLocaleString()}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    );
}