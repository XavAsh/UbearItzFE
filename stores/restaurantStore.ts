"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Restaurant } from "@/types";
import { PLACEHOLDER_DISH, PLACEHOLDER_RESTAURANT, resolveImageSrc } from "@/lib/images";
import { createRestaurantAsAdmin, deleteRestaurantAsAdmin, getRestaurants } from "@/services/api/restaurants";
import { slugify } from "@/lib/utils";

function normalizeRestaurant(restaurant: Restaurant): Restaurant {
  return {
    ...restaurant,
    image: resolveImageSrc(restaurant.image, PLACEHOLDER_RESTAURANT),
    dishes: (restaurant.dishes ?? []).map((dish) => ({
      ...dish,
      image: resolveImageSrc(dish.image, PLACEHOLDER_DISH),
    })),
  };
}

type NewRestaurantInput = {
  name: string;
  address: string;
  email: string; // owner/restaurant email used to create the owner account
  password: string;
  slug?: string;
  imageUrl?: string;
};

/**
 * Restaurant store keeps a cached list of restaurants fetched from the API.
 * All mutations happen client-side for now (mock-only).
 */
type RestaurantState = {
  restaurants: Restaurant[];
  loaded: boolean;
  status: "idle" | "loading" | "ready" | "error";
  error?: string;
  loadAll: (options?: { force?: boolean }) => Promise<void>;
  hasRestaurants: () => boolean;
  searchRestaurants: (term: string) => Restaurant[];
  addRestaurant: (input: NewRestaurantInput) => Promise<Restaurant>;
  removeRestaurant: (id: string) => Promise<void>;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => void;
  getRestaurantById: (id: string) => Restaurant | null;
};

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurants: [],
      loaded: false,
      status: "idle",
      error: undefined,
      async loadAll(options = {}) {
        if (!options.force && get().loaded && get().restaurants.length > 0) {
          set({ restaurants: get().restaurants.map(normalizeRestaurant), status: "ready" });
          return;
        }
        if (get().status === "loading") return;
        set({ status: "loading", error: undefined });
        try {
          const list = await getRestaurants();
          set({ restaurants: list.map(normalizeRestaurant), loaded: true, status: "ready" });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unable to load restaurants";
          set({ status: "error", error: message });
        }
      },
      hasRestaurants: () => get().restaurants.length > 0,
      searchRestaurants: (term: string) => {
        const normalized = term.trim().toLowerCase();
        if (!normalized) return get().restaurants;
        return get().restaurants.filter(
          (r) =>
            r.name.toLowerCase().includes(normalized) ||
            r.address?.toLowerCase().includes(normalized) ||
            r.description?.toLowerCase().includes(normalized)
        );
      },
      async addRestaurant(input) {
        const slug = input.slug?.trim() || slugify(input.name);
        const res = await createRestaurantAsAdmin({
          email: input.email,
          password: input.password,
          name: input.name,
          slug,
          address: input.address || null,
          imageUrl: input.imageUrl || null,
        });

        // Refresh list from API so the store stays consistent.
        const list = await getRestaurants();
        set({ restaurants: list.map(normalizeRestaurant), loaded: true, status: "ready" });

        // Return the created restaurant as a UI-friendly Restaurant.
        return {
          id: res.restaurant.id,
          name: res.restaurant.name,
          description: "",
          image: resolveImageSrc(res.restaurant.imageUrl, PLACEHOLDER_RESTAURANT),
          dishes: [],
          address: res.restaurant.address ?? undefined,
        };
      },
      async removeRestaurant(id) {
        await deleteRestaurantAsAdmin(id);
        const list = await getRestaurants();
        set({ restaurants: list.map(normalizeRestaurant), loaded: true, status: "ready" });
      },
      updateRestaurant(id, updates) {
        const restaurants = get().restaurants;
        const updated = restaurants.map((r) => (r.id === id ? normalizeRestaurant({ ...r, ...updates }) : r));
        set({ restaurants: updated });
      },
      getRestaurantById(id) {
        return get().restaurants.find((r) => r.id === id) || null;
      },
    }),
    {
      name: "restaurants",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.restaurants = state.restaurants.map(normalizeRestaurant);
      },
    },
  ),
);
