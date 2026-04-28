export type UserRole = "USER" | "RESTAURANT" | "ADMIN";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName?: string | null;
  lastName?: string | null;
  /**
   * Only present inside mock data / admin tooling.
   * Real APIs must never expose passwords.
   */
  password?: string;
}
