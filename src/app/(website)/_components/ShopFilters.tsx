"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { ProductFilters } from "@/features/products/queries.public";

interface ShopFiltersProps {
    categories: { id: string; name: string }[];
    collections: { id: string; name: string }[];
    currentFilters: ProductFilters;
    totalCount: number;
}

export function ShopFilters({
    categories,
    collections,
    currentFilters,
    totalCount,
}: ShopFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const updateFilter = useCallback(
        (key: string, value: string | undefined) => {
            startTransition(() => {
                const params = new URLSearchParams(searchParams.toString());
                if (value && value !== "all") {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }
                params.delete("page");
                router.push(`/shop?${params.toString()}`, { scroll: false });
            });
        },
        [router, searchParams]
    );

    const clearAll = useCallback(() => {
        startTransition(() => {
            router.push("/shop", { scroll: false });
        });
    }, [router]);

    const hasActiveFilters =
        currentFilters.search ||
        currentFilters.category ||
        currentFilters.collection ||
        currentFilters.featured ||
        currentFilters.new_arrival ||
        currentFilters.popular ||
        currentFilters.price_min !== undefined ||
        currentFilters.price_max !== undefined ||
        (currentFilters.sort && currentFilters.sort !== "newest");

    return (
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b py-4 -mx-4 px-4 md:-mx-0 md:px-0">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search products..."
                            defaultValue={currentFilters.search || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                const timeout = setTimeout(() => updateFilter("search", value || undefined), 300);
                                return () => clearTimeout(timeout);
                            }}
                            className="pl-10"
                        />
                    </div>
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {totalCount} product{totalCount !== 1 ? "s" : ""}
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <SlidersHorizontal className="h-4 w-4 text-muted-foreground hidden md:block" />

                    <Select
                        value={currentFilters.category || "all"}
                        onValueChange={(v) => updateFilter("category", v)}
                    >
                        <SelectTrigger className="w-[160px] h-9">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={currentFilters.collection || "all"}
                        onValueChange={(v) => updateFilter("collection", v)}
                    >
                        <SelectTrigger className="w-[160px] h-9">
                            <SelectValue placeholder="Collection" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Collections</SelectItem>
                            {collections.map((col) => (
                                <SelectItem key={col.id} value={col.id}>
                                    {col.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={currentFilters.sort || "newest"}
                        onValueChange={(v) => updateFilter("sort", v)}
                    >
                        <SelectTrigger className="w-[150px] h-9">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="featured">Featured</SelectItem>
                            <SelectItem value="popular">Popular</SelectItem>
                            <SelectItem value="price_asc">Price: Low → High</SelectItem>
                            <SelectItem value="price_desc">Price: High → Low</SelectItem>
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAll}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <X className="h-3 w-3 mr-1" />
                            Clear Filters
                        </Button>
                    )}

                    {isPending && (
                        <span className="text-xs text-muted-foreground animate-pulse">
                            Updating...
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}