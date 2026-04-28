"use client";

import { useEffect } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useOrderStore } from "@/stores/orderStore";
import { useI18n } from "@/lib/i18n";

export default function OrdersPageClient() {
  const orders = useOrderStore((state) => state.orders);
  const status = useOrderStore((state) => state.status);
  const error = useOrderStore((state) => state.error);
  const hydrateFromMock = useOrderStore((state) => state.hydrateFromMock);
  const clear = useOrderStore((state) => state.clear);
  const hasOrders = useOrderStore((state) => state.hasOrders());
  const latestOrder = useOrderStore((state) => state.latestOrder());
  const { t } = useI18n();

  useEffect(() => {
    if (orders.length === 0 && (status === "idle" || status === "error")) {
      hydrateFromMock();
    }
  }, [orders.length, status, hydrateFromMock]);

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
          <button onClick={() => hydrateFromMock(true)} className="underline text-blue-600 mt-2">
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
            <button onClick={() => hydrateFromMock(true)} className="underline">
                {t("orders.reload")}
            </button>
            <button onClick={clear} className="underline text-red-600">
                {t("orders.clear")}
            </button>
          </div>
        </div>
          {latestOrder && (
            <p className="text-sm text-gray-600 mb-4">
              {t("orders.latest").replace("{{date}}", new Date(latestOrder.createdAt).toLocaleDateString())}
            </p>
          )}
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="mb-4 border rounded p-4">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                <strong>{new Date(order.createdAt).toLocaleString()}</strong>
                <span className="uppercase text-xs tracking-wide">{order.status}</span>
                <span className="font-semibold">
                  {t("cart.total")}: €{order.total.toFixed(2)}
                </span>
              </div>
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

