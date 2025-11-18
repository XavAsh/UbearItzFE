"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuthStore } from "@/stores/authStore";
import { useRestaurantStore } from "@/stores/restaurantStore";
import { useI18n } from "@/lib/i18n";

const initialForm = {
  name: "",
  address: "",
  postalCode: "",
  city: "",
  contactEmail: "",
  password: "",
};

export default function AdminPageClient() {
  const { currentUser } = useAuthStore();
  const { restaurants, loadAll, addRestaurant, removeRestaurant } = useRestaurantStore();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await addRestaurant(form);
      setForm(initialForm);
    } finally {
      setSaving(false);
    }
  }

  return (
    <RequireAuth allowedRoles={["admin"]} fallbackMessage={t("admin.only")}>
      <main className="p-6 max-w-4xl mx-auto space-y-8">
        <header>
          <h1 className="text-3xl font-semibold mb-1">{t("admin.heading")}</h1>
          <p className="text-sm text-gray-600">{t("admin.loggedIn").replace("{{email}}", currentUser?.email ?? "")}</p>
        </header>

        <section>
          <h2 className="text-xl font-medium mb-3">{t("admin.add")}</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
            <input className="border rounded px-3 py-2" placeholder="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
            <input className="border rounded px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            <input className="border rounded px-3 py-2" type="email" placeholder="Restaurant Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} required />
            <input className="border rounded px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <div className="md:col-span-2">
              <button type="submit" disabled={saving} className="bg-black text-white rounded px-4 py-2 disabled:opacity-60">
                {saving ? t("actions.saving") : t("actions.save")}
              </button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="text-xl font-medium mb-3">{t("admin.list")}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="border rounded p-4 flex items-start justify-between gap-3">
                <div className="font-semibold">{restaurant.name}</div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">{restaurant.city ? `${restaurant.address}, ${restaurant.postalCode} ${restaurant.city}` : restaurant.description}</div>
                  {restaurant.contactEmail && <div className="text-sm">{restaurant.contactEmail}</div>}
                </div>
                <button className="text-red-600 text-sm underline" onClick={() => removeRestaurant(restaurant.id)} aria-label={`${t("cart.remove")} ${restaurant.name}`}>
                  {t("cart.remove")}
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}

