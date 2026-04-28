import type { Dish, Restaurant } from "@/types";
import { apiFetch } from "@/services/http";

type ApiRestaurant = {
  id: string;
  name: string;
  slug: string;
  address: string | null;
  imageUrl: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
};

type ApiDish = {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  priceCents: number;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

function mapDish(d: ApiDish): Dish {
  return {
    id: d.id,
    restaurantId: d.restaurantId,
    name: d.name,
    description: d.description ?? "",
    image: d.imageUrl ?? "",
    price: d.priceCents / 100,
  };
}

function mapRestaurant(r: ApiRestaurant, dishes: Dish[]): Restaurant {
  return {
    id: r.id,
    name: r.name,
    description: "",
    image: r.imageUrl ?? "",
    dishes,
    address: r.address ?? undefined,
  };
}

export async function getRestaurants(): Promise<Restaurant[]> {
  const restaurants = await apiFetch<ApiRestaurant[]>("/restaurants");
  const dishesByRestaurant = await Promise.all(
    restaurants.map(async (r) => {
      const dishes = await apiFetch<ApiDish[]>(`/restaurants/${r.id}/dishes`);
      return [r.id, dishes.filter((d) => d.isActive).map(mapDish)] as const;
    }),
  );
  const dishMap = new Map(dishesByRestaurant);
  return restaurants.map((r) => mapRestaurant(r, dishMap.get(r.id) ?? []));
}

export async function getRestaurantById(id: string): Promise<Restaurant> {
  const list = await getRestaurants();
  const found = list.find((r) => r.id === id);
  if (!found) throw new Error("Restaurant not found");
  return found;
}

// Kept for compatibility with existing pages: restaurant identity is resolved by token on the backend.
export async function getRestaurantByEmail(_email: string): Promise<Restaurant> {
  const r = await apiFetch<ApiRestaurant>("/restaurants/me", { auth: true });
  const dishes = await apiFetch<ApiDish[]>(`/restaurants/${r.id}/dishes`);
  return mapRestaurant(r, dishes.filter((d) => d.isActive).map(mapDish));
}

export async function createRestaurantAsAdmin(input: {
  email: string;
  password: string;
  name: string;
  slug: string;
  address?: string | null;
  imageUrl?: string | null;
}) {
  return apiFetch<{ owner: { id: string; email: string; role: string }; restaurant: ApiRestaurant }>("/restaurants", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      email: input.email,
      password: input.password,
      name: input.name,
      slug: input.slug,
      address: input.address ?? null,
      imageUrl: input.imageUrl ?? null,
    }),
  });
}

export async function deleteRestaurantAsAdmin(restaurantId: string) {
  return apiFetch<{ deleted: true }>("/restaurants/" + encodeURIComponent(restaurantId), {
    method: "DELETE",
    auth: true,
  });
}

export async function updateMyRestaurant(input: { name?: string; address?: string | null; imageUrl?: string | null }) {
  return apiFetch<ApiRestaurant>("/restaurants/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({
      name: input.name,
      address: input.address,
      imageUrl: input.imageUrl,
    }),
  });
}
