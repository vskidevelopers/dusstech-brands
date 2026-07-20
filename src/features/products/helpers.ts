export interface CartProductItem {
  type: "product";
  product_id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  image: string | null;
  quantity: number;
  slug: string;
}

export function createCartProductItem(product: {
  id: string;
  name: string;
  price: number;
  compare_at_price: number | null;
  featured_image: string | null;
  slug: string;
}): CartProductItem {
  return {
    type: "product",
    product_id: product.id,
    name: product.name,
    price: product.price,
    compare_at_price: product.compare_at_price,
    image: product.featured_image,
    quantity: 1,
    slug: product.slug,
  };
}

export function getProductWhatsAppMessage(
  productName: string,
  customMessage?: string | null,
): string {
  if (customMessage) return customMessage;
  return `Hello, I'm interested in the ${productName} product.`;
}
