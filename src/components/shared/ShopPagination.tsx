
import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl: string;
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Link
                    key={pageNum}
                    href={`${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${pageNum}`}
                    className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        pageNum === currentPage
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                >
                    {pageNum}
                </Link>
            ))}
        </div>
    );
}