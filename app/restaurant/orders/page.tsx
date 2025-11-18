"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRestaurantStore } from "@/stores/restaurantStore";

type OrderItem = { dishId: string; name: string; price: number; quantity: number };
type Order = {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "cancelled" | "closed";
  createdAt: string;
};

export default function RestaurantOrdersPage() {
  const { currentUser } = useAuthStore();
  const { restaurants, loadAll, getRestaurantByEmail } = useRestaurantStore();
  const [restaurant, setRestaurant] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadAll().then(() => {
      if (currentUser?.email) {
        const found = getRestaurantByEmail(currentUser.email);
        if (found) {
          setRestaurant(found.id);
          loadOrders(found.id);
        }
      }
    });
  }, [currentUser, loadAll, getRestaurantByEmail]);

  function loadOrders(restaurantId: string) {
    const data = JSON.parse(localStorage.getItem("orders") || "[]") as Order[];
    const restaurantOrders = data.filter((o) => o.restaurantId === restaurantId);
    setOrders(restaurantOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  }

  function updateOrderStatus(orderId: string, newStatus: Order["status"]) {
    const allOrders = JSON.parse(localStorage.getItem("orders") || "[]") as Order[];
    const updated = allOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem("orders", JSON.stringify(updated));
    if (restaurant) {
      loadOrders(restaurant);
    }
  }

  if (!currentUser || currentUser.role !== "restaurant") {
    return (
      <main className="p-6">
        <p>Access denied. Restaurant accounts only.</p>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="p-6">
        <p>Restaurant not found. Please contact admin.</p>
      </main>
    );
  }

  const statusOptions: Order["status"][] = ["pending", "preparing", "ready", "cancelled", "closed"];

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="font-semibold">Order #{order.id.slice(-6)}</div>
                  <div className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-lg font-semibold">€{order.total.toFixed(2)}</div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Status</label>
                <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])} className="border rounded px-3 py-2">
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-3">
                <div className="text-sm font-medium mb-2">Items:</div>
                <ul className="space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="text-sm">
                      {item.quantity}x {item.name} — €{(item.price * item.quantity).toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
