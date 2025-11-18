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
      status: "idle",
      error: undefined,
      async loadAll(options = {}) {
        if (!options.force && get().loaded && get().restaurants.length > 0) {
          set({ status: "ready" });
          return;
        }
        if (get().status === "loading") return;
        set({ status: "loading", error: undefined });
        try {
          const list = await getRestaurants();
          set({ restaurants: list, loaded: true, status: "ready" });
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
            r.city?.toLowerCase().includes(normalized) ||
            r.description?.toLowerCase().includes(normalized)
        );
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
        set({ restaurants: updated, loaded: true, status: "ready" });
        return newRestaurant;
      },
      removeRestaurant(id) {
        const next = get().restaurants.filter((r) => r.id !== id);
        const wasLoaded = get().loaded;
        set({ restaurants: next, loaded: wasLoaded && next.length > 0 });
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
