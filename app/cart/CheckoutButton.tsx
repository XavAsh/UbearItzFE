"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { useAuthStore } from "@/stores/authStore";
import { useI18n } from "@/lib/i18n";

export default function CheckoutButton() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice);
  const clear = useCartStore((state) => state.clear);
  const isCartEmpty = useCartStore((state) => state.isEmpty());
  const placeOrder = useOrderStore((state) => state.placeOrder);
  const currentUser = useAuthStore((state) => state.currentUser);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  const checkout = async () => {
    if (isCartEmpty || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await placeOrder({
        userId: currentUser?.id ?? "u-guest",
        restaurantId: items[0].restaurantId,
        items: items.map(({ dishId, name, price, quantity }) => ({ dishId, name, price, quantity })),
      });
      clear();
      router.push("/orders");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong while checking out";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4">
      <button onClick={checkout} disabled={isCartEmpty || submitting} className="bg-black text-white px-4 py-2 rounded disabled:opacity-50">
        {submitting ? t("cart.processing") : t("cart.checkout")}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-2" role="status" aria-live="polite">
          {error}
        </p>
      )}
    </div>
  );
}
