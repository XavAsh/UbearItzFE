import { cache } from "react";
import { getRestaurantByEmail, getRestaurantById, getRestaurants } from "@/services/api/restaurants";

export const fetchRestaurants = cache(async () => {
  return getRestaurants();
});

export const fetchRestaurantById = cache(async (id: string) => {
  return getRestaurantById(id);
});

export const fetchRestaurantByEmail = cache(async (email: string) => {
  return getRestaurantByEmail(email);
});

