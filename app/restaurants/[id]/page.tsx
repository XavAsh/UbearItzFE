"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRestaurantStore } from "@/stores/restaurantStore";
import type { Restaurant } from "@/types";
import BackToRestaurants from "@/components/common/BackToRestaurants";
import DishCard from "@/components/restaurant/DIshCard";

export default function RestaurantPage() {
  const params = useParams();
  const id = params.id as string;
  const { restaurants, loadAll, getRestaurantById } = useRestaurantStore();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAll().then(() => {
      const found = getRestaurantById(id);
      setRestaurant(found);
      setLoading(false);
    });
  }, [id, loadAll, getRestaurantById]);

  if (loading) {
    return (
      <main className="p-6">
        <p>Loading restaurant...</p>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="p-6">
        <p>Restaurant not found.</p>
        <BackToRestaurants className="text-sm text-gray-600 hover:underline mt-4 inline-block" />
      </main>
    );
  }

  return (
    <main>
      <div className="mb-6">
        <BackToRestaurants className="text-sm text-gray-600 hover:underline mb-4 inline-block" />
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-gray-700">{restaurant.description}</p>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurant.dishes.map((d) => (
          <DishCard key={d.id} dish={d} />
        ))}
        {restaurant.dishes.length === 0 && <p className="text-gray-500">No dishes available.</p>}
      </div>
    </main>
  );
}
