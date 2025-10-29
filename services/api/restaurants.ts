import data from "@/services/mock/mock-data.json";
import { simulateNetwork, notFound } from "@/services/http";
import type { Restaurant } from "@/types";

export async function getRestaurants(): Promise<Restaurant[]> {
  return simulateNetwork(data.restaurants);
}

export async function getRestaurantById(id: string): Promise<Restaurant> {
  const restaurant = data.restaurants.find((r) => r.id === id);
  if (!restaurant) notFound("Restaurant not found");
  return simulateNetwork(restaurant);
}
