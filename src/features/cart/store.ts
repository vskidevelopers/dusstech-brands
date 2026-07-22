import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

export interface CartServiceItem {
  type: "service";
  service_id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

export type CartItem = CartProductItem | CartServiceItem;

export interface OrderItem {
  type: "product" | "service";
  item_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  lastAddedItem: CartItem | null;

  addItem: (item: CartItem) => void;
  removeItem: (id: string, type: "product" | "service") => void;
  updateQuantity: (
    id: string,
    type: "product" | "service",
    quantity: number,
  ) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  transformToOrderItems: () => OrderItem[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      lastAddedItem: null,

      addItem: (item) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.type === item.type &&
              ((i.type === "product" &&
                i.product_id === (item as CartProductItem).product_id) ||
                (i.type === "service" &&
                  i.service_id === (item as CartServiceItem).service_id)),
          );

          let newItems: CartItem[];

          if (existingIndex >= 0) {
            newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + item.quantity,
            };
          } else {
            newItems = [...state.items, item];
          }

          return {
            items: newItems,
            isDrawerOpen: true, // ✅ Auto-open drawer on add
            lastAddedItem: item, // ✅ Track what was just added
          };
        });
      },

      removeItem: (id, type) => {
        set((state) => ({
          items: state.items.filter((item) => {
            if (item.type !== type) return true;
            if (type === "product")
              return (item as CartProductItem).product_id !== id;
            if (type === "service")
              return (item as CartServiceItem).service_id !== id;
            return true;
          }),
        }));
      },

      updateQuantity: (id, type, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) => {
            if (item.type !== type) return item;
            if (
              type === "product" &&
              (item as CartProductItem).product_id === id
            ) {
              return { ...item, quantity };
            }
            if (
              type === "service" &&
              (item as CartServiceItem).service_id === id
            ) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [], lastAddedItem: null }),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      transformToOrderItems: () => {
        return get().items.map((item) => ({
          type: item.type,
          item_id: item.type === "product" ? item.product_id : item.service_id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.price * item.quantity,
        }));
      },
    }),
    {
      name: "dusstech-cart",
      // ✅ Don't persist drawer state — only persist items
      partialize: (state) => ({ items: state.items }),
    },
  ),
);

// ✅ Helper to create cart items
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

export function createCartServiceItem(service: {
  id: string;
  name: string;
  price: number;
  featured_image: string | null;
}): CartServiceItem {
  return {
    type: "service",
    service_id: service.id,
    name: service.name,
    price: service.price,
    image: service.featured_image,
    quantity: 1,
  };
}
