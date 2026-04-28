import { describe, it, expect, beforeEach } from "vitest";
import { useCartStore } from "@/stores/cartStore";
import type { Dish } from "@/types";

describe("cartStore", () => {
  const dish: Dish = {
    id: "d-1",
    name: "Test Dish",
    price: 10,
    image: "",
    description: "",
    restaurantId: "r-1",
  };

  beforeEach(() => {
    const { clear } = useCartStore.getState();
    clear();
  });

  it("adds and increments items", () => {
    const { addItem, items, itemCount, totalPrice } = useCartStore.getState();
    addItem(dish);
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(itemCount()).toBe(1);
    expect(totalPrice()).toBe(10);

    addItem(dish);
    const i = useCartStore.getState().items[0];
    expect(i.quantity).toBe(2);
    expect(itemCount()).toBe(2);
    expect(totalPrice()).toBe(20);
  });

  it("decrements and removes at 1", () => {
    const { addItem, decrementItem } = useCartStore.getState();
    addItem(dish);
    addItem(dish);
    decrementItem(dish.id);
    expect(useCartStore.getState().items[0].quantity).toBe(1);
    decrementItem(dish.id);
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("removes specific item", () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem(dish);
    removeItem(dish.id);
    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
