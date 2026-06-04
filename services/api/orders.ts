import type { Order, OrderItem } from "@/types";
import { mapApiStatusToUi, type ApiOrderStatus } from "@/lib/orderStatus";
import { apiFetch, type PaginatedResponse, unwrapPaginated } from "@/services/http";

export type { ApiOrderStatus };

const LIST_LIMIT = 100;

type ApiOrderItem = {
  id: string;
  orderId: string;
  dishId: string;
  quantity: number;
  unitPriceCents: number;
  dish?: { name: string };
  createdAt: string;
  updatedAt: string;
};

type ApiOrder = {
  id: string;
  userId: string;
  restaurantId: string;
  status: ApiOrderStatus;
  totalCents: number;
  items: ApiOrderItem[];
  createdAt: string;
  updatedAt: string;
};

async function mapOrder(api: ApiOrder): Promise<Order> {
  const items: OrderItem[] = api.items.map((it) => ({
    dishId: it.dishId,
    name: it.dish?.name ?? it.dishId,
    price: it.unitPriceCents / 100,
    quantity: it.quantity,
  }));

  return {
    id: api.id,
    userId: api.userId,
    restaurantId: api.restaurantId,
    items,
    total: api.totalCents / 100,
    apiStatus: api.status,
    status: mapApiStatusToUi(api.status),
    createdAt: api.createdAt,
    updatedAt: api.updatedAt,
  };
}

export async function getOrders(): Promise<Order[]> {
  const api = await apiFetch<PaginatedResponse<ApiOrder>>(`/users/me/orders?limit=${LIST_LIMIT}`, {
    auth: true,
  });
  return Promise.all(unwrapPaginated(api).map(mapOrder));
}

export async function getOrdersByUser(_userId: string): Promise<Order[]> {
  // Backend scopes by token; keep signature for compatibility.
  return getOrders();
}

type CreateOrderInput = {
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
  const api = await apiFetch<PaginatedResponse<ApiOrder>>(
    `/restaurants/me/orders?limit=${LIST_LIMIT}`,
    { auth: true },
  );
  return Promise.all(unwrapPaginated(api).map(mapOrder));
}

export async function updateRestaurantOrderStatus(orderId: string, status: ApiOrder["status"]) {
  await apiFetch<void>("/restaurants/me/orders/" + encodeURIComponent(orderId) + "/status", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({ status }),
  });
}

export async function cancelOrder(orderId: string): Promise<void> {
  await apiFetch<unknown>("/orders/" + encodeURIComponent(orderId), {
    method: "DELETE",
    auth: true,
  });
}


