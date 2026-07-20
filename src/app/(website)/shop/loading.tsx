export default function ShopLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Skeleton */}
            <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse mb-6" />
                    <div className="h-12 w-72 bg-muted rounded animate-pulse mb-4" />
                    <div className="h-6 w-96 bg-muted rounded animate-pulse" />
                </div>
            </div>

            {/* Filters + Grid Skeleton */}
            <div className="container mx-auto px-4 py-12">
                {/* Sticky Filters Skeleton */}
                <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b py-4 -mx-4 px-4 md:-mx-0 md:px-0 mb-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between gap-4">
                            <div className="h-10 w-full max-w-md bg-muted rounded animate-pulse" />
                            <div className="h-4 w-20 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="h-9 w-[160px] bg-muted rounded animate-pulse" />
                            <div className="h-9 w-[160px] bg-muted rounded animate-pulse" />
                            <div className="h-9 w-[150px] bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>

                {/* Product Grid Skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="rounded-lg border overflow-hidden">
                            <div className="aspect-square bg-muted animate-pulse" />
                            <div className="p-4 space-y-3">
                                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                                <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
                                <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                                <div className="flex gap-2 pt-1">
                                    <div className="h-9 flex-1 bg-muted rounded animate-pulse" />
                                    <div className="h-9 w-9 bg-muted rounded animate-pulse" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Skeleton */}
                <div className="flex justify-center gap-2 mt-12">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-10 w-10 bg-muted rounded animate-pulse" />
                    ))}
                </div>
            </div>

            {/* CTA Skeleton */}
            <div className="bg-primary/5 py-16 md:py-24">
                <div className="container mx-auto px-4 text-center">
                    <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto mb-4" />
                    <div className="h-5 w-80 bg-muted rounded animate-pulse mx-auto mb-8" />
                    <div className="h-12 w-48 bg-muted rounded animate-pulse mx-auto" />
                </div>
            </div>
        </div>
    );
}