import type { Dish } from "./dish";
import type { ApiOrderStatus } from "@/lib/orderStatus";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export interface OrderItem {
  dishId: Dish["id"];
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  /** Raw API status — use for restaurant status transitions */
  apiStatus: ApiOrderStatus;
  createdAt: string;
  updatedAt?: string;
}


