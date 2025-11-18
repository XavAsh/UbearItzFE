"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Restaurant } from "@/types";
import { getRestaurants } from "@/services/api/restaurants";

type NewRestaurantInput = {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  contactEmail: string;
  password: string; // captured but not used in mock
};

type RestaurantState = {
  restaurants: Restaurant[];
  loaded: boolean;
  loadAll: () => Promise<void>;
  addRestaurant: (input: NewRestaurantInput) => Promise<Restaurant>;
  removeRestaurant: (id: string) => void;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  getRestaurantByEmail: (email: string) => Restaurant | null;
  getRestaurantById: (id: string) => Restaurant | null;
};

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurants: [],
      loaded: false,
      async loadAll() {
        if (get().loaded && get().restaurants.length > 0) return;
        const list = await getRestaurants();
        set({ restaurants: list, loaded: true });
      },
      async addRestaurant(input) {
        const newRestaurant: Restaurant = {
          id: `r-${Date.now()}`,
          name: input.name,
          description: "",
          image: "/images/restaurants/le-bearitz.webp",
          dishes: [],
          address: input.address,
          postalCode: input.postalCode,
          city: input.city,
          contactEmail: input.contactEmail,
        };
        const current = get().restaurants;
        const updated = [newRestaurant, ...current];
        set({ restaurants: updated, loaded: true });
        return newRestaurant;
      },
      removeRestaurant(id) {
        const next = get().restaurants.filter((r) => r.id !== id);
        set({ restaurants: next });
      },
      updateRestaurant(id, updates) {
        const restaurants = get().restaurants;
        const updated = restaurants.map((r) => (r.id === id ? { ...r, ...updates } : r));
        set({ restaurants: updated });
      },
      getRestaurantByEmail(email) {
        return get().restaurants.find((r) => r.contactEmail === email) || null;
      },
      getRestaurantById(id) {
        return get().restaurants.find((r) => r.id === id) || null;
      },
    }),
    { name: "restaurants" }
  )
);
