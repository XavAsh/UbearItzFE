import type { Order, OrderItem } from "@/types";
import { apiFetch } from "@/services/http";
import { getDishById } from "@/services/api/dishes";

type ApiOrderItem = {
  id: string;
  orderId: string;
  dishId: string;
  quantity: number;
  unitPriceCents: number;
  createdAt: string;
  updatedAt: string;
};

type ApiOrder = {
  id: string;
  userId: string;
  restaurantId: string;
  status: "PENDING" | "CONFIRMED" | "PAID" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
  totalCents: number;
  items: ApiOrderItem[];
  createdAt: string;
  updatedAt: string;
};

function mapStatus(s: ApiOrder["status"]): Order["status"] {
  switch (s) {
    case "PENDING":
      return "pending";
    case "PREPARING":
      return "preparing";
    case "READY":
      return "ready";
    case "DELIVERED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
    case "CONFIRMED":
    case "PAID":
      return "pending";
  }
}

async function mapOrder(api: ApiOrder): Promise<Order> {
  const dishCache = new Map<string, { name: string }>();

  const items: OrderItem[] = await Promise.all(
    api.items.map(async (it) => {
      if (!dishCache.has(it.dishId)) {
        const dish = await getDishById(it.dishId);
        dishCache.set(it.dishId, { name: dish.name });
      }
      return {
        dishId: it.dishId,
        name: dishCache.get(it.dishId)!.name,
        price: it.unitPriceCents / 100,
        quantity: it.quantity,
      };
    }),
  );

  return {
    id: api.id,
    userId: api.userId,
    restaurantId: api.restaurantId,
    items,
    total: api.totalCents / 100,
    status: mapStatus(api.status),
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export async function getOrders(): Promise<Order[]> {
  const api = await apiFetch<ApiOrder[]>("/users/me/orders", { auth: true });
  return Promise.all(api.map(mapOrder));
}

export async function getOrdersByUser(_userId: string): Promise<Order[]> {
  // Backend scopes by token; keep signature for compatibility.
  return getOrders();
}

type CreateOrderInput = {
  userId: string;
  restaurantId: string;
  items: OrderItem[];
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const payload = {
    restaurantId: input.restaurantId,
    items: input.items.map((i) => ({ dishId: i.dishId, quantity: i.quantity })),
  };
  const api = await apiFetch<ApiOrder>("/orders", { method: "POST", auth: true, body: JSON.stringify(payload) });
  return mapOrder(api);
}

export async function getRestaurantOrders(): Promise<Order[]> {
  const api = await apiFetch<ApiOrder[]>("/restaurants/me/orders", { auth: true });
  return Promise.all(api.map(mapOrder));
}

export async function updateRestaurantOrderStatus(orderId: string, status: ApiOrder["status"]) {
  return apiFetch<ApiOrder>("/restaurants/me/orders/" + encodeURIComponent(orderId) + "/status", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status }),
  });
}


