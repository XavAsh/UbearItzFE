import { create } from "zustand";
import type { Dish } from "@/types";

type CartItem = {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantId: string;
};

type CartState = {
  items: CartItem[];
  addItem: (dish: Dish) => void;
  decrementItem: (dishId: string) => void;
  removeItem: (dishId: string) => void;
  clear: () => void;
  totalPrice: () => number;
  itemCount: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (dish: Dish) => {
    set((s) => {
      const idx = s.items.findIndex((i: CartItem) => i.dishId === dish.id);
      if (idx >= 0) {
        const items: CartItem[] = [...s.items];
        items[idx] = { ...items[idx], quantity: items[idx].quantity + 1 };
        return { items };
      }
      const next: CartItem[] = [
        ...s.items,
        {
          dishId: dish.id,
          name: dish.name,
          price: dish.price,
          quantity: 1,
          restaurantId: dish.restaurantId,
        },
      ];
      return { items: next };
    });
  },
  decrementItem: (dishId: string) => {
    set((s) => {
      const idx = s.items.findIndex((i: CartItem) => i.dishId === dishId);
      if (idx === -1) return { items: s.items };
      const item: CartItem = s.items[idx];
      if (item.quantity <= 1) {
        return { items: s.items.filter((i: CartItem) => i.dishId !== dishId) };
      }
      const items: CartItem[] = [...s.items];
      items[idx] = { ...item, quantity: item.quantity - 1 };
      return { items };
    });
  },
  removeItem: (dishId: string) => set((s) => ({ items: s.items.filter((i: CartItem) => i.dishId !== dishId) })),
  clear: () => set({ items: [] }),
  totalPrice: () => get().items.reduce<number>((sum: number, i: CartItem) => sum + i.price * i.quantity, 0),
  itemCount: () => get().items.reduce<number>((sum: number, i: CartItem) => sum + i.quantity, 0),
}));
