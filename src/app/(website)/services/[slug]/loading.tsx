export default function ServiceDetailLoading() {
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="h-4 w-48 bg-muted rounded animate-pulse mb-8" />
                <div className="grid gap-12 lg:grid-cols-2">
                    <div className="aspect-square bg-muted rounded-lg animate-pulse" />
                    <div className="space-y-6">
                        <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                        <div className="h-10 w-3/4 bg-muted rounded animate-pulse" />
                        <div className="h-8 w-32 bg-muted rounded animate-pulse" />
                        <div className="flex gap-3">
                            <div className="h-12 flex-1 bg-muted rounded animate-pulse" />
                            <div className="h-12 flex-1 bg-muted rounded animate-pulse" />
                        </div>
                        <div className="h-32 bg-muted rounded-lg animate-pulse" />
                        <div className="h-48 bg-muted rounded-lg animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}