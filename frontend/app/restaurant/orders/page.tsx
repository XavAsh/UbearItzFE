"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import RequireAuth from "@/components/auth/RequireAuth";
import { getRestaurantByEmail } from "@/services/api/restaurants";
import { getRestaurantOrders, updateRestaurantOrderStatus } from "@/services/api/orders";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { useI18n } from "@/lib/i18n";
import type { Order } from "@/types";

export default function RestaurantOrdersPage() {
  const { currentUser } = useAuthStore();
  const [restaurant, setRestaurant] = useState<{ id: string; name: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const { t } = useI18n();

  const email = currentUser?.email ?? null;
  const { data, error, loading } = useAsyncData(
    email ? `restaurant-me-${email}` : "restaurant-me-guest",
    () => {
      if (!email) return Promise.reject(new Error("Missing restaurant email"));
      return getRestaurantByEmail(email);
    },
    { enabled: Boolean(email), ttlMs: 60_000 },
  );

  useEffect(() => {
    if (data) {
      setRestaurant({ id: data.id, name: data.name });
      getRestaurantOrders()
        .then(setOrders)
        .catch((e) => console.error(e));
    }
  }, [data]);

  async function updateOrderStatus(orderId: string, newStatus: Order["status"]) {
    // Map UI → API enum
    const apiStatus =
      newStatus === "preparing"
        ? "PREPARING"
        : newStatus === "ready"
          ? "READY"
          : newStatus === "cancelled"
            ? "CANCELLED"
            : newStatus === "completed"
              ? "DELIVERED"
              : "CONFIRMED";

    await updateRestaurantOrderStatus(orderId, apiStatus);
    const next = await getRestaurantOrders();
    setOrders(next);
  }

  if (!currentUser || currentUser.role !== "RESTAURANT") {
    return (
      <RequireAuth allowedRoles={["RESTAURANT"]}>
        <main className="p-6">
          <p>{t("auth.accessDeniedMessage")}</p>
        </main>
      </RequireAuth>
    );
  }

  if (loading) {
    return (
      <RequireAuth allowedRoles={["RESTAURANT"]}>
        <main className="p-6">
          <p>{t("restaurant.portal.loading")}</p>
        </main>
      </RequireAuth>
    );
  }

  if (error) {
    return (
      <RequireAuth allowedRoles={["RESTAURANT"]}>
        <main className="p-6">
          <p className="text-red-600">{error}</p>
        </main>
      </RequireAuth>
    );
  }

  if (!restaurant) {
    return (
      <main className="p-6">
        <p>{t("restaurant.portal.notFound")}</p>
      </main>
    );
  }

  const statusOptions: Order["status"][] = ["pending", "preparing", "ready", "completed", "cancelled"];

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {t("nav.orders")} — {restaurant.name}
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">{t("restaurant.orders.empty")}</p>
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
                <label className="block text-sm font-medium mb-1">{t("restaurant.orders.status")}</label>
                <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value as Order["status"])} className="border rounded px-3 py-2">
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-3">
                <div className="text-sm font-medium mb-2">{t("restaurant.orders.items")}:</div>
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
