"use client";

import {
  ORDER_STATUS_FLOW,
  orderStatusFlowIndex,
  orderStatusLabelKey,
  type ApiOrderStatus,
} from "@/lib/orderStatus";
import { useI18n } from "@/lib/i18n";

type OrderStatusFlowProps = {
  current: ApiOrderStatus;
};

export default function OrderStatusFlow({ current }: OrderStatusFlowProps) {
  const { t } = useI18n();
  const flowIndex = orderStatusFlowIndex(current);

  if (current === "CANCELLED") {
    return (
      <p className="text-sm text-red-700 font-medium" role="status">
        {t(orderStatusLabelKey("CANCELLED"))}
      </p>
    );
  }

  if (current === "PAID") {
    return (
      <div className="space-y-2">
        <ol className="flex flex-wrap gap-1 text-xs sm:text-sm">
          {ORDER_STATUS_FLOW.map((step, index) => {
            const done = index < flowIndex;
            const active = index === flowIndex;
            return (
              <li
                key={step}
                className={`rounded px-2 py-1 ${
                  active ? "bg-blue-600 text-white font-medium" : done ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
                }`}
              >
                {t(orderStatusLabelKey(step))}
              </li>
            );
          })}
        </ol>
        <p className="text-xs text-gray-600">{t("orderStatus.PAID")} — {t("restaurant.orders.paidNote")}</p>
      </div>
    );
  }

  return (
    <ol className="flex flex-wrap gap-1 text-xs sm:text-sm" aria-label={t("restaurant.orders.workflow")}>
      {ORDER_STATUS_FLOW.map((step, index) => {
        const done = index < flowIndex;
        const active = index === flowIndex;
        return (
          <li
            key={step}
            className={`rounded px-2 py-1 ${
              active ? "bg-blue-600 text-white font-medium" : done ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"
            }`}
          >
            {t(orderStatusLabelKey(step))}
          </li>
        );
      })}
    </ol>
  );
}
