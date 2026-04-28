"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuthStore } from "@/stores/authStore";
import type { Restaurant, Dish } from "@/types";
import { getRestaurantByEmail } from "@/services/api/restaurants";
import { createDish, deleteDish } from "@/services/api/dishes";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { useI18n } from "@/lib/i18n";

export default function RestaurantDishesPage() {
  const { currentUser } = useAuthStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);
  const { t } = useI18n();

  const email = currentUser?.email ?? null;
  const { data, error, loading, refetch } = useAsyncData(
    email ? `restaurant-${email}` : "restaurant-guest",
    () => {
      if (!email) {
        return Promise.reject(new Error("Missing restaurant email"));
      }
      return getRestaurantByEmail(email);
    },
    { enabled: Boolean(email), ttlMs: 5 * 60 * 1000 }
  );

  useEffect(() => {
    if (data) {
      setRestaurant(data);
      setDishes(data.dishes || []);
    }
  }, [data]);

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
        <main className="p-6 space-y-3">
          <p className="text-red-600">{error}</p>
          <button onClick={refetch} className="underline text-blue-600">
            {t("orders.reload")}
          </button>
        </main>
      </RequireAuth>
    );
  }

  if (!restaurant) {
    return (
      <RequireAuth allowedRoles={["RESTAURANT"]}>
        <main className="p-6">
          <p>{t("restaurant.portal.notFound")}</p>
        </main>
      </RequireAuth>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      const newDish = await createDish({
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        imageUrl: form.image || null,
      });
      const updatedDishes = [newDish, ...dishes];
      setDishes(updatedDishes);
      setForm({ name: "", price: "", description: "", image: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  async function removeDish(dishId: string) {
    try {
      await deleteDish(dishId);
      setDishes((prev) => prev.filter((d) => d.id !== dishId));
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <RequireAuth allowedRoles={["RESTAURANT"]}>
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">{t("restaurant.portal.title")}</h1>

        <section className="mb-8">
          <h2 className="text-xl font-medium mb-3">{t("restaurant.portal.add")}</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              className="border rounded px-3 py-2"
              placeholder={t("restaurant.portal.dishName")}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className="border rounded px-3 py-2"
              type="number"
              step="0.01"
              placeholder={t("restaurant.portal.price")}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
            <input
              className="border rounded px-3 py-2"
              placeholder={t("restaurant.portal.imageUrl")}
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
            <input
              className="border rounded px-3 py-2"
              placeholder={t("restaurant.portal.description")}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="bg-black text-white rounded px-4 py-2 disabled:opacity-60">
                {saving ? t("actions.saving") : t("restaurant.portal.add")}
              </button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-3">
            {t("restaurant.portal.list")} ({dishes.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dishes.map((dish) => (
              <div key={dish.id} className="border rounded p-4 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="font-semibold">{dish.name}</div>
                  <div className="text-sm text-gray-600">{dish.description}</div>
                  <div className="text-sm font-medium mt-1">€{dish.price.toFixed(2)}</div>
                </div>
                <button className="text-red-600 text-sm underline" onClick={() => removeDish(dish.id)} aria-label={`${t("cart.remove")} ${dish.name}`}>
                  {t("cart.remove")}
                </button>
              </div>
            ))}
            {dishes.length === 0 && <p className="text-gray-500">{t("restaurant.portal.none")}</p>}
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}
