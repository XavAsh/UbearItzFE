"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRestaurantStore } from "@/stores/restaurantStore";
import type { Restaurant } from "@/types";

export default function RestaurantInfoPage() {
  const { currentUser } = useAuthStore();
  const { loadAll, updateRestaurant, getRestaurantByEmail } = useRestaurantStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    address: "",
    postalCode: "",
    city: "",
    contactEmail: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll().then(() => {
      if (currentUser?.email) {
        const found = getRestaurantByEmail(currentUser.email);
        if (found) {
          setRestaurant(found);
          setForm({
            name: found.name || "",
            description: found.description || "",
            address: found.address || "",
            postalCode: found.postalCode || "",
            city: found.city || "",
            contactEmail: found.contactEmail || "",
          });
        }
      }
    });
  }, [currentUser, loadAll, getRestaurantByEmail]);

  if (!currentUser) {
    return (
      <main className="p-6">
        <p>You must be logged in.</p>
        <a href="/login" className="underline">
          Go to login
        </a>
      </main>
    );
  }

  if (currentUser.role !== "restaurant") {
    return (
      <main className="p-6">
        <p>Access denied. Restaurant accounts only.</p>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="p-6">
        <p>Restaurant not found. Please contact admin.</p>
      </main>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (saving || !restaurant) return;
    setSaving(true);
    try {
      // Mock PUT request - update in store
      updateRestaurant(restaurant.id, form);
      setSaving(false);
      alert("Restaurant info updated!");
    } catch (error) {
      console.error(error);
      setSaving(false);
    }
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Restaurant</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contact Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input className="w-full border rounded px-3 py-2" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Postal Code</label>
            <input className="w-full border rounded px-3 py-2" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input className="w-full border rounded px-3 py-2" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
          </div>
        </div>

        <button type="submit" disabled={saving} className="bg-black text-white rounded px-4 py-2 disabled:opacity-60">
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
