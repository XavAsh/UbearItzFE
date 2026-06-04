"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import RequireAuth from "@/components/auth/RequireAuth";
import { getMyRestaurant } from "@/services/api/restaurants";
import {
  getRestaurantOrders,
  updateRestaurantOrderStatus,
  type ApiOrderStatus,
} from "@/services/api/orders";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { formatDateTime } from "@/lib/formatDate";
import OrderStatusFlow from "@/components/orders/OrderStatusFlow";
import { getNextApiStatuses, orderStatusLabelKey } from "@/lib/orderStatus";
import { useI18n } from "@/lib/i18n";
import type { Order } from "@/types";
import { ApiError } from "@/services/http";

export default function RestaurantOrdersPage() {
  return (
    <RequireAuth allowedRoles={["RESTAURANT"]}>
      <RestaurantOrdersContent />
    </RequireAuth>
  );
}

function RestaurantOrdersContent() {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [restaurant, setRestaurant] = useState<{ id: string; name: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { t } = useI18n();

  const cacheKey = currentUser?.id ? `restaurant-me-${currentUser.id}` : "restaurant-me";
  const { data, error, loading } = useAsyncData(
    cacheKey,
    () => getMyRestaurant(),
    { enabled: Boolean(currentUser?.id), ttlMs: 60_000 },
  );

  useEffect(() => {
    if (data) {
      setRestaurant({ id: data.id, name: data.name });
      getRestaurantOrders()
        .then(setOrders)
        .catch((e) => console.error(e));
    }
  }, [data]);

  async function advanceOrderStatus(orderId: string, nextStatus: ApiOrderStatus) {
    setStatusError(null);
    setUpdatingId(orderId);
    try {
      await updateRestaurantOrderStatus(orderId, nextStatus);
      setOrders(await getRestaurantOrders());
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : t("error.description");
      setStatusError(message);
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p>{t("restaurant.portal.loading")}</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="p-6 max-w-4xl mx-auto">
        <p>{t("restaurant.portal.notFound")}</p>
      </main>
    );
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {t("nav.orders")} — {restaurant.name}
      </h1>

      {statusError && (
        <p className="text-red-600 text-sm mb-4" role="alert">
          {statusError}
        </p>
      )}

      {orders.length === 0 ? (
        <p className="text-gray-500">{t("restaurant.orders.empty")}</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const nextStatuses = getNextApiStatuses(order.apiStatus);
            return (
              <div key={order.id} className="border rounded p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold">Order #{order.id.slice(-6)}</div>
                    <div className="text-sm text-gray-600">{formatDateTime(order.createdAt)}</div>
                  </div>
                  <div className="text-lg font-semibold">€{order.total.toFixed(2)}</div>
                </div>

                <div className="mb-3">
                  <div className="text-sm font-medium mb-1">{t("restaurant.orders.status")}</div>
                  <OrderStatusFlow current={order.apiStatus} />
                  <p className="text-sm text-gray-600 mt-2">
                    {t("restaurant.orders.currentStep")}:{" "}
                    <span className="font-medium">{t(orderStatusLabelKey(order.apiStatus))}</span>
                  </p>

                  {nextStatuses.length > 0 ? (
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600 mb-1" htmlFor={`status-${order.id}`}>
                        {t("restaurant.orders.advanceTo")}
                      </label>
                      <select
                        id={`status-${order.id}`}
                        defaultValue=""
                        disabled={updatingId === order.id}
                        onChange={(e) => {
                          const value = e.target.value as ApiOrderStatus;
                          if (!value) return;
                          void advanceOrderStatus(order.id, value);
                          e.target.value = "";
                        }}
                        className="border rounded px-3 py-2"
                      >
                        <option value="">{t("restaurant.orders.chooseAction")}</option>
                        {nextStatuses.map((status) => (
                          <option key={status} value={status}>
                            {t(orderStatusLabelKey(status))}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">{t("restaurant.orders.finalStatus")}</p>
                  )}
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
            );
          })}
        </div>
      )}
    </main>
  );
}
