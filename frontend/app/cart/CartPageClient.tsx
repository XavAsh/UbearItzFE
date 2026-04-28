"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { useCartStore } from "@/stores/cartStore";
import CheckoutButton from "./CheckoutButton";
import { useI18n } from "@/lib/i18n";

export default function CartPageClient() {
  const { items, totalPrice, itemCount, removeItem, decrementItem, addItem, clear, isEmpty } = useCartStore();
  const hasItems = !isEmpty();
  const { t } = useI18n();

  return (
    <RequireAuth>
      <main className="p-6">
        <h1 className="text-3xl font-semibold mb-4">{t("cart.title")}</h1>
        {!hasItems && <p>{t("cart.empty")}</p>}
        {hasItems && (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.dishId} className="flex flex-col gap-2 border rounded p-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span>€{item.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <button onClick={() => decrementItem(item.dishId)} className="border px-2 py-1 rounded" aria-label={t("cart.decrement")}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      addItem({
                        id: item.dishId,
                        name: item.name,
                        price: item.price,
                        image: "",
                        description: "",
                        restaurantId: item.restaurantId,
                      })
                    }
                    className="border px-2 py-1 rounded"
                    aria-label={t("cart.increment")}
                  >
                    +
                  </button>
                  <button onClick={() => removeItem(item.dishId)} className="text-red-600 underline ml-auto" aria-label={`${t("cart.remove")} ${item.name}`}>
                    {t("cart.remove")}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-6 space-y-2">
          <p>
            <strong>{t("cart.total")}:</strong> €{totalPrice().toFixed(2)}
          </p>
          <p>
            <strong>{t("cart.items")}:</strong> {itemCount()}
          </p>
          <button onClick={clear} disabled={!hasItems} className="underline text-sm disabled:opacity-50">
            {t("cart.clear")}
          </button>
        </div>
        <CheckoutButton />
      </main>
    </RequireAuth>
  );
}

