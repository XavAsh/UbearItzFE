"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useRestaurantStore } from "@/stores/restaurantStore";
import type { Restaurant, Dish } from "@/types";

export default function RestaurantDishesPage() {
  const { currentUser } = useAuthStore();
  const { restaurants, loadAll, updateRestaurant, getRestaurantByEmail } = useRestaurantStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadAll().then(() => {
      if (currentUser?.email) {
        const found = getRestaurantByEmail(currentUser.email);
        if (found) {
          setRestaurant(found);
          setDishes(found.dishes || []);
        }
      }
    });
  }, [currentUser, loadAll, getRestaurantByEmail]);

  if (!currentUser || currentUser.role !== "restaurant") {
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
    if (saving) return;
    setSaving(true);
    try {
      const newDish: Dish = {
        id: `d-${Date.now()}`,
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        image: form.image || "/images/dishes/truffle-pasta.avif",
        restaurantId: restaurant.id,
      };
      const updatedDishes = [newDish, ...dishes];
      setDishes(updatedDishes);
      updateRestaurant(restaurant.id, { dishes: updatedDishes });
      setForm({ name: "", price: "", description: "", image: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  function removeDish(dishId: string) {
    const updatedDishes = dishes.filter((d) => d.id !== dishId);
    setDishes(updatedDishes);
    updateRestaurant(restaurant.id, { dishes: updatedDishes });
  }

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Dishes</h1>

      <section className="mb-8">
        <h2 className="text-xl font-medium mb-3">Add a dish</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border rounded px-3 py-2" placeholder="Dish Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input
            className="border rounded px-3 py-2"
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
          <input className="border rounded px-3 py-2" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <input
            className="border rounded px-3 py-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <div className="md:col-span-2">
            <button type="submit" disabled={saving} className="bg-black text-white rounded px-4 py-2 disabled:opacity-60">
              {saving ? "Saving…" : "Add Dish"}
            </button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-medium mb-3">All dishes ({dishes.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dishes.map((dish) => (
            <div key={dish.id} className="border rounded p-4 flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-semibold">{dish.name}</div>
                <div className="text-sm text-gray-600">{dish.description}</div>
                <div className="text-sm font-medium mt-1">€{dish.price.toFixed(2)}</div>
              </div>
              <button className="text-red-600 text-sm underline" onClick={() => removeDish(dish.id)} aria-label={`Remove ${dish.name}`}>
                Remove
              </button>
            </div>
          ))}
          {dishes.length === 0 && <p className="text-gray-500">No dishes yet. Add your first dish above.</p>}
        </div>
      </section>
    </main>
  );
}
