export type UserRole = "customer" | "restaurant" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
}
