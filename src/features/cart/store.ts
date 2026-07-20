import { create } from "zustand";
import { persist } from "zustand/middleware";

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

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, type: "product" | "service") => void;
  updateQuantity: (
    id: string,
    type: "product" | "service",
    quantity: number,
  ) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
  transformToOrderItems: () => OrderItem[];
}

export interface OrderItem {
  type: "product" | "service";
  item_id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

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

          if (existingIndex >= 0) {
            const newItems = [...state.items];
            newItems[existingIndex] = {
              ...newItems[existingIndex],
              quantity: newItems[existingIndex].quantity + item.quantity,
            };
            return { items: newItems };
          }

          return { items: [...state.items, item] };
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

      clearCart: () => set({ items: [] }),

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
    },
  ),
);
