import data from "@/services/mock/mock-data.json";
import { simulateNetwork, notFound } from "@/services/http";
import type { Dish } from "@/types";

export async function getDishById(id: string): Promise<Dish> {
  const allDishes = data.restaurants.flatMap((r) => r.dishes);
  const dish = allDishes.find((d) => d.id === id);
  if (!dish) notFound("Dish not found");
  return simulateNetwork(dish);
}

export async function getDishesByRestaurant(restaurantId: string): Promise<Dish[]> {
  const restaurant = data.restaurants.find((r) => r.id === restaurantId);
  if (!restaurant) notFound("Restaurant not found");
  return simulateNetwork(restaurant.dishes);
}
