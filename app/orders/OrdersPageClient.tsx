"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useOrderStore } from "@/stores/orderStore";
import { useI18n } from "@/lib/i18n";
import { cancelOrder } from "@/services/api/orders";
import { formatDateTime } from "@/lib/formatDate";
import { orderStatusLabelKey } from "@/lib/orderStatus";

export default function OrdersPageClient() {
  const orders = useOrderStore((state) => state.orders);
  const status = useOrderStore((state) => state.status);
  const error = useOrderStore((state) => state.error);
  const refreshOrders = useOrderStore((state) => state.refreshOrders);
  const clear = useOrderStore((state) => state.clear);
  const hasOrders = useOrderStore((state) => state.hasOrders());
  const latestOrder = useOrderStore((state) => state.latestOrder());
  const { t } = useI18n();
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  async function cancelPending(orderId: string) {
    setCancelError(null);
    setCancelingId(orderId);
    try {
      await cancelOrder(orderId);
      await refreshOrders();
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : t("error.description"));
    } finally {
      setCancelingId(null);
    }
  }

  useEffect(() => {
    void refreshOrders();
  }, [refreshOrders]);

  useEffect(() => {
    const onFocus = () => void refreshOrders();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [refreshOrders]);

  if (status === "loading" && !orders.length) {
    return (
      <RequireAuth>
        <main className="p-6">
          <h1 className="text-3xl font-semibold mb-4">{t("orders.title")}</h1>
          <p>{t("orders.loading")}</p>
        </main>
      </RequireAuth>
    );
  }

  if (!hasOrders) {
    return (
      <RequireAuth>
        <main className="p-6">
          <h1 className="text-3xl font-semibold mb-4">{t("orders.title")}</h1>
          {error ? (
            <p className="text-red-600" role="alert">
              {t("orders.error")}
            </p>
          ) : (
            <p>{t("orders.empty")}</p>
          )}
          <button onClick={() => void refreshOrders()} className="underline text-blue-600 mt-2">
            {t("orders.loadSamples")}
          </button>
        </main>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <main className="p-6">
        <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-semibold">{t("orders.title")}</h1>
          <div className="flex gap-3 text-sm">
            <button onClick={() => void refreshOrders()} className="underline">
                {t("orders.reload")}
            </button>
            <button onClick={clear} className="underline text-red-600">
                {t("orders.clear")}
            </button>
          </div>
        </div>
        {cancelError && (
          <p className="text-red-600 text-sm mb-4" role="alert">
            {cancelError}
          </p>
        )}
          {latestOrder && (
            <p className="text-sm text-gray-600 mb-4">
              {t("orders.latest").replace("{{date}}", formatDateTime(latestOrder.createdAt))}
            </p>
          )}
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-4 border rounded p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <div>
                  <div className="text-sm text-gray-500">Order #{order.id.slice(-6)}</div>
                  <strong>{formatDateTime(order.createdAt)}</strong>
                </div>
                <span className="uppercase text-xs tracking-wide">{t(orderStatusLabelKey(order.apiStatus))}</span>
                <span className="font-semibold">
                  {t("cart.total")}: €{order.total.toFixed(2)}
                </span>
              </div>
              {order.apiStatus === "PENDING" && (
                <div className="mb-3">
                  <button
                    className="underline text-red-600 text-sm"
                    disabled={cancelingId === order.id}
                    onClick={() => void cancelPending(order.id)}
                  >
                    {cancelingId === order.id ? t("orders.cancelling") : t("orders.cancel")}
                  </button>
                </div>
              )}
              <ul className="ml-4 list-disc">
                {order.items.map((item) => (
                  <li key={`${order.id}-${item.dishId}`}>
                    {item.quantity} × {item.name} — {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </main>
    </RequireAuth>
  );
}

