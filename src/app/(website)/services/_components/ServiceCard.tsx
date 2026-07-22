"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, MessageCircle, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, getServiceWhatsAppMessage, getWhatsAppUrl } from "@/features/services/helpers";
import type { PublicService } from "@/features/services/queries.public";
import { toast } from "sonner";

interface ServiceCardProps {
  service: PublicService;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Integrate with your cart store (e.g., Zustand)
    // useCartStore.getState().addService(service);
    toast.success(`${service.name} added to cart`);
  };

  const whatsappUrl = getWhatsAppUrl(
    "254722277778",
    getServiceWhatsAppMessage(service.name, service.whatsapp_message)
  );

  return (
    <Card className="group overflow-hidden border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <Link href={`/services/${service.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-muted">
        {service.featured_image ? (
          <Image
            src={service.featured_image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <span className="text-sm">No image</span>
          </div>
        )}
        {service.featured && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Service
          </span>
        </div>
      </Link>

      {/* Content */}
      <CardContent className="p-4 space-y-3">
        <div>
          {service.category_name && (
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {service.category_name}
            </span>
          )}
          <Link href={`/services/${service.slug}`}>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {service.name}
            </h3>
          </Link>
        </div>

        {service.short_description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {service.short_description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-foreground">
            {formatPrice(service.starting_price ?? 0, service.pricing_type)}
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add
          </Button>
          <Button
            size="sm"
            variant="outline"
            asChild
          >
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-3 w-3" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}