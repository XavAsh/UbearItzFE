import { cache } from "react";
import { getRestaurantByEmail, getRestaurantById, getRestaurants } from "@/services/api/restaurants";

export const fetchRestaurants = cache(async () => {
  return getRestaurants();
});

export const fetchRestaurantById = cache(async (id: string) => {
  try {
    return await getRestaurantById(id);
  } catch (error) {
    console.error("Failed to load restaurant", id, error);
    throw error;
  }
});

export const fetchRestaurantByEmail = cache(async (email: string) => {
  return getRestaurantByEmail(email);
});


