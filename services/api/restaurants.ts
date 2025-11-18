import data from "@/services/mock/mock-data.json";
import { simulateNetwork, notFound } from "@/services/http";
import type { Restaurant } from "@/types";

/**
 * Fetch every restaurant from the mock dataset.
 * Network latency is simulated to keep parity with real HTTP calls.
 */
export async function getRestaurants(): Promise<Restaurant[]> {
  return simulateNetwork(data.restaurants);
}

/**
 * Retrieve a single restaurant by id or raise an HTTP-like 404 error.
 */
export async function getRestaurantById(id: string): Promise<Restaurant> {
  const restaurant = data.restaurants.find((r) => r.id === id);
  if (!restaurant) notFound("Restaurant not found");
  return simulateNetwork(restaurant);
}

export async function getRestaurantByEmail(email: string): Promise<Restaurant> {
  const restaurant = data.restaurants.find((r) => r.contactEmail === email);
  if (!restaurant) notFound("Restaurant not found for this email");
  return simulateNetwork(restaurant);
}
