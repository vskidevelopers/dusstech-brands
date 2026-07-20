import Link from "next/link";
import { SearchX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
    title?: string;
    description?: string;
    clearFiltersHref?: string;
    showBackHome?: boolean;
}

export function EmptyState({
    title = "No items found",
    description = "We couldn't find any items matching your filters. Try adjusting your search or clearing the filters.",
    clearFiltersHref,
    showBackHome = false,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
                <SearchX className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
            <div className="flex gap-3">
                {clearFiltersHref && (
                    <Button asChild>
                        <Link href={clearFiltersHref}>Clear All Filters</Link>
                    </Button>
                )}
                {showBackHome && (
                    <Button variant="outline" asChild>
                        <Link href="/">
                            <Home className="h-4 w-4 mr-2" />
                            Back to Home
                        </Link>
                    </Button>
                )}
            </div>
        </div>
    );
}