import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOrderStore } from "@/stores/orderStore";
import type { Order } from "@/types";

const { mockOrders } = vi.hoisted(() => ({
  mockOrders: [
    {
      id: "o-test-1",
      userId: "u-1",
      restaurantId: "r-1",
      items: [{ dishId: "d-1", name: "Test Dish", price: 10, quantity: 1 }],
      total: 10,
      status: "pending",
      createdAt: new Date().toISOString(),
    },
  ] satisfies Order[],
}));

vi.mock("@/services/api/orders", () => ({
  getOrders: vi.fn().mockResolvedValue(mockOrders),
  createOrder: vi.fn().mockImplementation(async ({ userId, restaurantId, items }) => ({
    id: "o-new",
    userId,
    restaurantId,
    items,
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    status: "pending",
    createdAt: new Date().toISOString(),
  })),
}));

describe("orderStore", () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [], status: "idle", error: undefined });
  });

  it("hydrates orders from mock data", async () => {
    await useOrderStore.getState().hydrateFromMock(true);
    expect(useOrderStore.getState().orders).toHaveLength(1);
    expect(useOrderStore.getState().hasOrders()).toBe(true);
  });

  it("places a new order and prepends it", async () => {
    await useOrderStore.getState().hydrateFromMock(true);
    const { placeOrder, orders } = useOrderStore.getState();
    const newOrder = await placeOrder({
      userId: "u-123",
      restaurantId: "r-1",
      items: [{ dishId: "d-1", name: "Test", price: 12, quantity: 2 }],
    });

    const updatedOrders = useOrderStore.getState().orders;
    expect(updatedOrders[0].id).toBe(newOrder.id);
    expect(updatedOrders).toHaveLength(orders.length + 1);
  });
});


