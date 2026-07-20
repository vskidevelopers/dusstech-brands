import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesEmpty() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="rounded-full bg-muted p-6 mb-6">
                <SearchX className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No services found</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
                We couldn&apos;t find any services matching your filters. Try adjusting your
                search or clearing the filters.
            </p>
            <Button asChild>
                <Link href="/services">Clear All Filters</Link>
            </Button>
        </div>
    );
}