import type { Dish } from "@/types";
import { apiFetch } from "@/services/http";

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

export async function getDishById(id: string): Promise<Dish> {
  const dish = await apiFetch<ApiDish>(`/dishes/${id}`);
  return mapDish(dish);
}

export async function getDishesByRestaurant(restaurantId: string): Promise<Dish[]> {
  const dishes = await apiFetch<ApiDish[]>(`/restaurants/${restaurantId}/dishes`);
  return dishes.filter((d) => d.isActive).map(mapDish);
}

export async function createDish(input: { name: string; description: string; price: number; imageUrl?: string | null }) {
  const created = await apiFetch<ApiDish>("/dishes", {
    method: "POST",
    auth: true,
    body: JSON.stringify({
      name: input.name,
      description: input.description || null,
      priceCents: Math.round(input.price * 100),
      imageUrl: input.imageUrl ?? null,
    }),
  });
  return mapDish(created);
}

export async function deleteDish(dishId: string) {
  return apiFetch<{ deleted: true }>("/dishes/" + encodeURIComponent(dishId), {
    method: "DELETE",
    auth: true,
  });
}

export async function updateDish(
  dishId: string,
  updates: Partial<{ name: string; description: string; price: number; imageUrl: string | null; isActive: boolean }>,
) {
  const updated = await apiFetch<ApiDish>("/dishes/" + encodeURIComponent(dishId), {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({
      name: updates.name,
      description: updates.description === undefined ? undefined : updates.description || null,
      priceCents: updates.price === undefined ? undefined : Math.round(updates.price * 100),
      imageUrl: updates.imageUrl,
      isActive: updates.isActive,
    }),
  });
  return mapDish(updated);
}
