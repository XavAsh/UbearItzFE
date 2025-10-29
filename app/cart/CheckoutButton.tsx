"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";

type OrderItem = { dishId: string; name: string; price: number; quantity: number };
type Order = {
  id: string;
  userId: string; // replace with real user later
  restaurantId: string;
  items: OrderItem[];
  total: number;
  status: "pending";
  createdAt: string;
};

export default function CheckoutButton() {
  const router = useRouter();
  const { items, totalPrice, clear } = useCartStore();

  const checkout = () => {
    if (!items.length) return;

    const order: Order = {
      id: `o-${Date.now()}`,
      userId: "u-guest", // TODO: plug real auth later
      restaurantId: items[0].restaurantId,
      items: items.map(({ dishId, name, price, quantity }) => ({ dishId, name, price, quantity })),
      total: totalPrice(),
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem("orders") || "[]") as Order[];
    localStorage.setItem("orders", JSON.stringify([order, ...existing]));

    clear();
    router.push("/orders");
  };

  return <button onClick={checkout}>Checkout</button>;
}
