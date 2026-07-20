"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItemType = "product" | "service";

export interface CartItem {
  id: string;
  type: CartItemType;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  image?: string;
  metadata?: Record<string, string>;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string, type: CartItemType) => void;
  updateQuantity: (id: string, type: CartItemType, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.id === item.id && i.type === item.type,
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id && i.type === item.type
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity: 1 }] });
        }
      },

      removeItem: (id, type) => {
        set({
          items: get().items.filter((i) => !(i.id === id && i.type === type)),
        });
      },

      updateQuantity: (id, type, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id, type);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.id === id && i.type === type ? { ...i, quantity } : i,
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "dusstech-cart",
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
