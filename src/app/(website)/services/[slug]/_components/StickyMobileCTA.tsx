"use client";

import { ShoppingCart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StickyMobileCTAProps {
    name: string;
    price: string;
    whatsappUrl: string;
}

export function StickyMobileCTA({ name, price, whatsappUrl }: StickyMobileCTAProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t p-4">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs text-muted-foreground truncate max-w-[120px]">{name}</p>
                    <p className="text-lg font-bold text-foreground">{price}</p>
                </div>
                <div className="flex gap-2 flex-1">
                    <Button size="sm" className="flex-1">
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4" />
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}