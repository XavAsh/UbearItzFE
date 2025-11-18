"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createOrder, getOrders } from "@/services/api/orders";
import type { Order, OrderItem, OrderStatus } from "@/types";

type RequestState = "idle" | "loading" | "ready" | "error";

const STORAGE_KEY = "orders-store";

const cleanupLegacyStorage = () => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem("orders");
  } catch {
    // ignore
  }
};

/**
 * Order store centralises order history and exposes helpers to seed or place orders.
 */
type OrderState = {
  orders: Order[];
  status: RequestState;
  error?: string;
  hydrateFromMock: (force?: boolean) => Promise<void>;
  placeOrder: (input: { userId: string; restaurantId: string; items: OrderItem[] }) => Promise<Order>;
  clear: () => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  hasOrders: () => boolean;
  latestOrder: () => Order | undefined;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      status: "idle",
      error: undefined,
      async hydrateFromMock(force = false) {
        if (!force && get().orders.length > 0) {
          set({ status: "ready" });
          return;
        }
        if (get().status === "loading") return;
        set({ status: "loading", error: undefined });
        try {
          const orders = await getOrders();
          set({ orders, status: "ready" });
          cleanupLegacyStorage();
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unable to fetch orders";
          set({ status: "error", error: message });
        }
      },
      async placeOrder({ userId, restaurantId, items }) {
        set({ status: "loading", error: undefined });
        try {
          const order = await createOrder({ userId, restaurantId, items });
          set({ orders: [order, ...get().orders], status: "ready" });
          cleanupLegacyStorage();
          return order;
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unable to place order";
          set({ status: "error", error: message });
          throw err;
        }
      },
      clear() {
        set({ orders: [], status: "idle", error: undefined });
        cleanupLegacyStorage();
      },
      getOrderById(id) {
        return get().orders.find((order) => order.id === id);
      },
      getOrdersByStatus(status) {
        return get().orders.filter((order) => order.status === status);
      },
      hasOrders() {
        return get().orders.length > 0;
      },
      latestOrder() {
        return get().orders[0];
      },
    }),
    { name: STORAGE_KEY }
  )
);

