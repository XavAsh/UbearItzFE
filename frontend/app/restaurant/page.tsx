"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import type { Restaurant } from "@/types";
import RequireAuth from "@/components/auth/RequireAuth";
import { getRestaurantByEmail, updateMyRestaurant } from "@/services/api/restaurants";
import { useAsyncData } from "@/lib/hooks/useAsyncData";
import { useI18n } from "@/lib/i18n";

export default function RestaurantInfoPage() {
  const { currentUser } = useAuthStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    imageUrl: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
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
    if (!data) return;
    setRestaurant(data);
    setForm({
      name: data.name || "",
      address: data.address || "",
      imageUrl: data.image || "",
    });
    setSaved(false);
  }, [data]);

  if (!currentUser) {
    return (
      <RequireAuth>
        <main className="p-6">
          <p>{t("auth.requiredMessage")}</p>
        </main>
      </RequireAuth>
    );
  }

  if (currentUser.role !== "RESTAURANT") {
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

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !restaurant) return;
    setSaving(true);
    try {
      setSaved(false);
      await updateMyRestaurant({
        name: form.name.trim(),
        address: form.address.trim() ? form.address.trim() : null,
        imageUrl: form.imageUrl.trim() ? form.imageUrl.trim() : null,
      });
      setSaved(true);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{t("restaurant.profile.title")}</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t("restaurant.profile.name")}</label>
            <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t("restaurant.profile.email")}</label>
            <input className="w-full border rounded px-3 py-2" type="email" value={currentUser.email} disabled />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("restaurant.profile.address")}</label>
          <input className="w-full border rounded px-3 py-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">{t("restaurant.profile.imageUrl")}</label>
          <input className="w-full border rounded px-3 py-2" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} />
        </div>

        {saved && <p className="text-sm">{t("restaurant.profile.saved")}</p>}

        <button type="submit" disabled={saving} className="bg-black text-white rounded px-4 py-2 disabled:opacity-60">
          {saving ? t("actions.saving") : t("actions.save")}
        </button>
      </form>
    </main>
  );
}
