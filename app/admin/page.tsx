"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRestaurantStore } from "@/stores/restaurantStore";
import { useI18n } from "@/lib/i18n";

export default function AdminRestaurantsPage() {
  const { currentUser } = useAuthStore();
  const { restaurants, loadAll, addRestaurant, removeRestaurant } = useRestaurantStore();
  const { t } = useI18n();
  const [form, setForm] = useState({
    name: "",
    address: "",
    postalCode: "",
    city: "",
    contactEmail: "",
    password: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (!currentUser) {
    return (
      <main className="p-6">
        <p>You must be logged in to access admin.</p>
        <a href="/login" className="underline">
          Go to login
        </a>
      </main>
    );
  }

  if (currentUser.role !== "admin") {
    return (
      <main className="p-6">
        <p>{t("admin.accessDenied")}</p>
      </main>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    try {
      await addRestaurant(form);
      setForm({ name: "", address: "", postalCode: "", city: "", contactEmail: "", password: "" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Admin: Restaurants</h1>

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-3">Add a restaurant</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="border rounded px-3 py-2" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <input
            className="border rounded px-3 py-2"
            placeholder="Postal Code"
            value={form.postalCode}
            onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            required
          />
          <input className="border rounded px-3 py-2" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          <input
            className="border rounded px-3 py-2"
            type="email"
            placeholder="Restaurant Email"
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            required
          />
          <input
            className="border rounded px-3 py-2"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className="bg-black text-white rounded px-4 py-2 disabled:opacity-60">
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-3">All restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((r) => (
            <div key={r.id} className="border rounded p-4 flex items-start justify-between gap-3">
              <div className="font-semibold">{r.name}</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">{r.city ? `${r.address}, ${r.postalCode} ${r.city}` : r.description}</div>
                {r.contactEmail && <div className="text-sm">{r.contactEmail}</div>}
              </div>
              <button className="text-red-600 text-sm underline" onClick={() => removeRestaurant(r.id)} aria-label={`Remove ${r.name}`}>
                Remove
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
