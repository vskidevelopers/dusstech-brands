"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
    images: string[];
    alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (images.length === 0) {
        return (
            <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No images available</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted group">
                <Image
                    src={images[activeIndex]}
                    alt={`${alt} - Image ${activeIndex + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                />
            </div>

            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={cn(
                                "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all",
                                index === activeIndex
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent opacity-60 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${alt} thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}