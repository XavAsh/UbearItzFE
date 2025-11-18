export type UserRole = "customer" | "restaurant" | "admin";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  avatar?: string;
  /**
   * Only present inside mock data / admin tooling.
   * Real APIs must never expose passwords.
   */
  password?: string;
}
