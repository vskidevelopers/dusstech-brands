export function getWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function getServiceWhatsAppMessage(
  serviceName: string,
  customMessage?: string | null,
): string {
  if (customMessage) return customMessage;
  return `Hi, I'm interested in your ${serviceName} service. Could you share more details?`;
}

export function formatPrice(
  price: number,
  pricingType: "fixed" | "starting_from" | "custom_quote",
): string {
  if (pricingType === "custom_quote") return "Custom Quote";
  const formatted = new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(price);
  return pricingType === "starting_from" ? `From ${formatted}` : formatted;
}

export interface CartServiceItem {
  type: "service";
  service_id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

export function createCartServiceItem(service: {
  id: string;
  name: string;
  starting_price: number;
  featured_image: string | null;
}): CartServiceItem {
  return {
    type: "service",
    service_id: service.id,
    name: service.name,
    price: service.starting_price,
    image: service.featured_image,
    quantity: 1,
  };
}
