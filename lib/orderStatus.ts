/** Matches ubearitzBE OrderStatus enum and transition rules in orders.service.ts */
export type ApiOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export const RESTAURANT_STATUS_TRANSITIONS: Record<ApiOrderStatus, ApiOrderStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PAID: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export function getNextApiStatuses(current: ApiOrderStatus): ApiOrderStatus[] {
  return RESTAURANT_STATUS_TRANSITIONS[current] ?? [];
}

export function mapApiStatusToUi(
  status: ApiOrderStatus,
): "pending" | "confirmed" | "paid" | "preparing" | "ready" | "completed" | "cancelled" {
  switch (status) {
    case "PENDING":
      return "pending";
    case "CONFIRMED":
      return "confirmed";
    case "PAID":
      return "paid";
    case "PREPARING":
      return "preparing";
    case "READY":
      return "ready";
    case "DELIVERED":
      return "completed";
    case "CANCELLED":
      return "cancelled";
  }
}

export function orderStatusLabelKey(status: ApiOrderStatus): string {
  return `orderStatus.${status}`;
}

/** Main happy-path steps shown on the restaurant orders timeline (all still exist in the API). */
export const ORDER_STATUS_FLOW: ApiOrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "READY",
  "DELIVERED",
];

export function orderStatusFlowIndex(status: ApiOrderStatus): number {
  switch (status) {
    case "PENDING":
      return 0;
    case "CONFIRMED":
    case "PAID":
      return 1;
    case "PREPARING":
      return 2;
    case "READY":
      return 3;
    case "DELIVERED":
      return 4;
    case "CANCELLED":
      return -1;
  }
}
