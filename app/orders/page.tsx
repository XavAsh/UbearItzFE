"use client";

import { useEffect, useState } from "react";

type OrderItem = { dishId: string; name: string; price: number; quantity: number };
type Order = {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "cancelled";
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () => {
    const data = JSON.parse(localStorage.getItem("orders") || "[]") as Order[];
    setOrders(data);
  };

  useEffect(() => {
    setTimeout(() => load(), 0);
  }, []);

  const clearOrders = () => {
    localStorage.removeItem("orders");
    setOrders([]);
  };

  const seedOrders = () => {
    const sample: Order[] = [
      {
        id: `o-seed-1`,
        userId: "u-guest",
        restaurantId: "r-1",
        items: [
          { dishId: "d-1", name: "Truffle Pasta", price: 18.5, quantity: 1 },
          { dishId: "d-2", name: "Herb Chicken", price: 16, quantity: 2 },
        ],
        total: 50.5,
        status: "pending",
        createdAt: new Date().toISOString(),
      },
      {
        id: `o-seed-2`,
        userId: "u-guest",
        restaurantId: "r-2",
        items: [{ dishId: "d-3", name: "Salmon Nigiri (6)", price: 12, quantity: 3 }],
        total: 36,
        status: "ready",
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ];
    localStorage.setItem("orders", JSON.stringify(sample));
    load();
  };

  if (!orders.length) {
    return (
      <main>
        <h1>My Orders</h1>
        <p>No orders yet.</p>
        <button onClick={seedOrders}>Load sample orders</button>
      </main>
    );
  }

  return (
    <main>
      <h1>My Orders</h1>
      <button onClick={clearOrders}>Clear</button>
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            <strong>{new Date(o.createdAt).toLocaleString()}</strong> — {o.status} — Total: {o.total.toFixed(2)}
            <ul>
              {o.items.map((it, idx) => (
                <li key={idx}>
                  {it.quantity} x {it.name} — {(it.price * it.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
