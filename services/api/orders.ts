import { simulateNetwork } from "@/services/http";
import type { Order, OrderItem, OrderStatus } from "@/types";
import data from "@/services/mock/mock-data.json";

const seedOrders = data.orders as Order[];

/**
 * Return every demo order available in the mock dataset.
 * In real life this would be scoped by authenticated user/restaurant.
 */
export async function getOrders(): Promise<Order[]> {
  return simulateNetwork(seedOrders);
}

/**
 * Simple filter helper for user-specific order history.
 */
export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const orders = seedOrders.filter((order) => order.userId === userId);
  return simulateNetwork(orders);
}

type CreateOrderInput = {
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  status?: OrderStatus;
};

/**
 * Mock an order creation response. This does not persist anywhere yet but mimics
 * the payload produced by a backend (id + timestamps).
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const total = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order: Order = {
    id: `o-${Date.now()}`,
    userId: input.userId,
    restaurantId: input.restaurantId,
    items: input.items,
    total,
    status: input.status ?? "pending",
    createdAt: new Date().toISOString(),
  };
  return simulateNetwork(order);
}

