"use client";

import { useEffect } from "react";
import { useRestaurantStore } from "@/stores/restaurantStore";
import RestaurantCard from "@/components/restaurant/RestorantCard";

export default function RestaurantsPage() {
  const { restaurants, loadAll } = useRestaurantStore();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  if (!restaurants.length) {
    return <div>No restaurants found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  );
}
