"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    min?: number;
    max?: number;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export function QuantitySelector({
    quantity,
    onQuantityChange,
    min = 1,
    max = 999,
    size = "md",
    className,
}: QuantitySelectorProps) {
    const sizeClasses = {
        sm: "h-7 w-7",
        md: "h-9 w-9",
        lg: "h-11 w-11",
    };

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Button
                type="button"
                variant="outline"
                size="icon"
                className={sizeClasses[size]}
                onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
                disabled={quantity <= min}
            >
                <Minus className="h-3 w-3" />
            </Button>
            <span className="w-12 text-center font-medium tabular-nums animate-in fade-in duration-200">
                {quantity}
            </span>
            <Button
                type="button"
                variant="outline"
                size="icon"
                className={sizeClasses[size]}
                onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
                disabled={quantity >= max}
            >
                <Plus className="h-3 w-3" />
            </Button>
        </div>
    );
}