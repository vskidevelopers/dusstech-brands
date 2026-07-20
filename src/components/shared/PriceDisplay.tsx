import { cn } from "@/lib/utils";

interface PriceDisplayProps {
    price?: number | null;
    compareAtPrice?: number | null;
    pricingType?: "fixed" | "starting_from" | "custom_quote";
    className?: string;
}

export function PriceDisplay({
    price,
    compareAtPrice,
    pricingType = "fixed",
    className,
}: PriceDisplayProps) {
    if (pricingType === "custom_quote" || price === undefined || price === null || isNaN(Number(price))) {
        return (
            <span className={cn("text-lg font-bold text-foreground", className)}>
                Contact for Price
            </span>
        );
    }

    const validPrice = Number(price);
    const validCompareAtPrice = compareAtPrice ? Number(compareAtPrice) : null;

    const formatted = new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
    }).format(validPrice);

    const prefix = pricingType === "starting_from" ? "From " : "";

    return (
        <div className="flex items-center gap-2">
            <span className={cn("text-lg font-bold text-foreground", className)}>
                {prefix}{formatted}
            </span>
            {validCompareAtPrice && validCompareAtPrice > validPrice && (
                <span className="text-sm text-muted-foreground line-through">
                    {new Intl.NumberFormat("en-KE", {
                        style: "currency",
                        currency: "KES",
                        minimumFractionDigits: 0,
                    }).format(validCompareAtPrice)}
                </span>
            )}
        </div>
    );
}

export function calculateDiscount(price?: number | null, compareAtPrice?: number | null): number {
    if (!price || !compareAtPrice || compareAtPrice <= price) return 0;
    return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}