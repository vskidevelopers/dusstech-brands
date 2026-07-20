export default function ProductDetailLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                {/* Breadcrumb Skeleton */}
                <div className="h-4 w-48 bg-muted rounded animate-pulse mb-8" />

                {/* Main Grid Skeleton */}
                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Gallery Skeleton */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="w-20 h-20 bg-muted rounded-md animate-pulse" />
                            ))}
                        </div>
                    </div>

                    {/* Product Info Skeleton */}
                    <div className="space-y-6">
                        <div>
                            <div className="h-6 w-24 bg-muted rounded animate-pulse mb-3" />
                            <div className="h-10 w-3/4 bg-muted rounded animate-pulse mb-3" />
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                            </div>
                        </div>

                        <div className="h-20 bg-muted rounded animate-pulse" />

                        <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                            <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                            <div className="flex items-center gap-2">
                                <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                                <div className="h-9 w-12 bg-muted rounded animate-pulse" />
                                <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="h-12 flex-1 bg-muted rounded animate-pulse" />
                            <div className="h-12 flex-1 bg-muted rounded animate-pulse" />
                        </div>

                        <div className="h-12 w-full bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Specifications Skeleton */}
                <div className="mt-16">
                    <div className="h-8 w-40 bg-muted rounded animate-pulse mb-6" />
                    <div className="rounded-lg border overflow-hidden">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className={`flex ${i % 2 === 0 ? "bg-muted/50" : "bg-background"}`}>
                                <div className="w-1/3 px-6 py-4">
                                    <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                                </div>
                                <div className="w-2/3 px-6 py-4">
                                    <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Branding Notes Skeleton */}
                <div className="mt-12">
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-6">
                        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-2" />
                        <div className="h-20 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Description Skeleton */}
                <div className="mt-12">
                    <div className="h-8 w-32 bg-muted rounded animate-pulse mb-6" />
                    <div className="space-y-3">
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                        <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                    </div>
                </div>

                {/* Related Products Skeleton */}
                <div className="mt-20">
                    <div className="h-8 w-48 bg-muted rounded animate-pulse mb-8" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="rounded-lg border overflow-hidden">
                                <div className="aspect-square bg-muted animate-pulse" />
                                <div className="p-4 space-y-3">
                                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                                    <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recently Viewed Skeleton */}
                <div className="mt-20">
                    <div className="h-8 w-40 bg-muted rounded animate-pulse mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="rounded-lg border overflow-hidden">
                                <div className="aspect-square bg-muted animate-pulse" />
                                <div className="p-3 space-y-2">
                                    <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                    <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sticky Mobile CTA Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t p-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                        <div className="h-9 w-8 bg-muted rounded animate-pulse" />
                        <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex gap-2 flex-1">
                        <div className="h-9 flex-1 bg-muted rounded animate-pulse" />
                        <div className="h-9 flex-1 bg-muted rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}