export default function ServicesLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-28">
                <div className="container mx-auto px-4">
                    <div className="h-4 w-24 bg-muted rounded animate-pulse mb-6" />
                    <div className="h-12 w-64 bg-muted rounded animate-pulse mb-4" />
                    <div className="h-6 w-96 bg-muted rounded animate-pulse" />
                </div>
            </div>
            <div className="container mx-auto px-4 py-12">
                <div className="h-10 w-full bg-muted rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="rounded-lg border overflow-hidden">
                            <div className="aspect-[4/3] bg-muted animate-pulse" />
                            <div className="p-4 space-y-3">
                                <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                                <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                                <div className="h-4 w-full bg-muted rounded animate-pulse" />
                                <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}