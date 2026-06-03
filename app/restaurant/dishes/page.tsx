"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuthStore } from "@/stores/authStore";
import type { Restaurant, Dish } from "@/types";
import { getMyRestaurant } from "@/services/api/restaurants";
import { createDish, deleteDish, updateDish } from "@/services/api/dishes";
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
  const [dishActionBusy, setDishActionBusy] = useState(false);
  const [dishActionError, setDishActionError] = useState<string | null>(null);
  const [editDishId, setEditDishId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    isActive: true,
  });
  const { t } = useI18n();

  const cacheKey = currentUser?.id ? `restaurant-${currentUser.id}` : "restaurant-guest";
  const { data, error, loading, refetch } = useAsyncData(
    cacheKey,
    () => getMyRestaurant(),
    { enabled: Boolean(currentUser?.id), ttlMs: 5 * 60 * 1000 }
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
    setDishActionError(null);
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
      setDishActionError(error instanceof Error ? error.message : t("error.description"));
    } finally {
      setSaving(false);
    }
  }

  async function removeDish(dishId: string) {
    try {
      setDishActionBusy(true);
      setDishActionError(null);
      await deleteDish(dishId);
      setDishes((prev) => prev.filter((d) => d.id !== dishId));
    } catch (error) {
      console.error(error);
      setDishActionError(error instanceof Error ? error.message : t("error.description"));
    } finally {
      setDishActionBusy(false);
    }
  }

  function startEdit(dish: Dish) {
    setEditDishId(dish.id);
    setEditForm({
      name: dish.name,
      price: dish.price.toString(),
      description: dish.description,
      image: dish.image,
      isActive: dish.isActive !== false,
    });
    setDishActionError(null);
  }

  function cancelEdit() {
    setEditDishId(null);
    setEditForm({ name: "", price: "", description: "", image: "", isActive: true });
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editDishId) return;
    if (dishActionBusy) return;
    setDishActionBusy(true);
    setDishActionError(null);
    try {
      const updated = await updateDish(editDishId, {
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        imageUrl: editForm.image || null,
        isActive: editForm.isActive,
      });
      setDishes((prev) => prev.map((d) => (d.id === editDishId ? updated : d)));
      cancelEdit();
    } catch (error) {
      console.error(error);
      setDishActionError(error instanceof Error ? error.message : t("error.description"));
    } finally {
      setDishActionBusy(false);
    }
  }

  async function toggleActive(dish: Dish) {
    if (dishActionBusy) return;
    setDishActionBusy(true);
    setDishActionError(null);
    try {
      const nextActive = dish.isActive === false;
      const updated = await updateDish(dish.id, { isActive: nextActive });
      setDishes((prev) => prev.map((d) => (d.id === dish.id ? updated : d)));
    } catch (error) {
      console.error(error);
      setDishActionError(error instanceof Error ? error.message : t("error.description"));
    } finally {
      setDishActionBusy(false);
    }
  }

  return (
    <RequireAuth allowedRoles={["RESTAURANT"]}>
      <main className="p-6 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">{t("restaurant.portal.title")}</h1>

        {dishActionError && (
          <p className="text-red-600 text-sm mb-4" role="alert">
            {dishActionError}
          </p>
        )}

        {editDishId && (
          <section className="mb-8 border rounded p-4">
            <h2 className="text-xl font-medium mb-3">{t("restaurant.portal.editDish")}</h2>
            <form onSubmit={saveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t("restaurant.portal.dishName")}</label>
                <input className="border rounded px-3 py-2 w-full" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("restaurant.portal.price")}</label>
                <input className="border rounded px-3 py-2 w-full" type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("restaurant.portal.status")}</label>
                <select
                  className="border rounded px-3 py-2 w-full"
                  value={editForm.isActive ? "active" : "inactive"}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === "active" })}
                >
                  <option value="active">{t("restaurant.portal.statusActive")}</option>
                  <option value="inactive">{t("restaurant.portal.statusInactive")}</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t("restaurant.portal.imageUrl")}</label>
                <input className="border rounded px-3 py-2 w-full" value={editForm.image} onChange={(e) => setEditForm({ ...editForm, image: e.target.value })} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">{t("restaurant.portal.description")}</label>
                <input className="border rounded px-3 py-2 w-full" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} required />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" disabled={dishActionBusy} className="bg-black text-white rounded px-4 py-2 disabled:opacity-60">
                  {dishActionBusy ? t("actions.saving") : t("actions.save")}
                </button>
                <button type="button" onClick={cancelEdit} disabled={dishActionBusy} className="underline rounded px-4 py-2 disabled:opacity-60">
                  {t("restaurant.portal.cancel")}
                </button>
              </div>
            </form>
          </section>
        )}

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
                  {dish.isActive === false && <div className="text-xs text-gray-500">{t("restaurant.portal.statusInactive")}</div>}
                  <div className="text-sm text-gray-600">{dish.description}</div>
                  <div className="text-sm font-medium mt-1">€{dish.price.toFixed(2)}</div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <button className="text-sm underline disabled:opacity-60" disabled={dishActionBusy} onClick={() => startEdit(dish)} aria-label={`${t("restaurant.portal.editDish")} ${dish.name}`}>
                    {t("restaurant.portal.edit")}
                  </button>
                  <button
                    className="text-sm underline disabled:opacity-60"
                    disabled={dishActionBusy}
                    onClick={() => void toggleActive(dish)}
                    aria-label={`${dish.isActive === false ? t("restaurant.portal.activate") : t("restaurant.portal.deactivate")} ${dish.name}`}
                  >
                    {dish.isActive === false ? t("restaurant.portal.activate") : t("restaurant.portal.deactivate")}
                  </button>
                  <button
                    className="text-red-600 text-sm underline disabled:opacity-60"
                    disabled={dishActionBusy}
                    onClick={() => void removeDish(dish.id)}
                    aria-label={`${t("cart.remove")} ${dish.name}`}
                  >
                    {t("cart.remove")}
                  </button>
                </div>
              </div>
            ))}
            {dishes.length === 0 && <p className="text-gray-500">{t("restaurant.portal.none")}</p>}
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}
