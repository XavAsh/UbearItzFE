import type { User, UserRole } from "@/types";
import { simulateNetwork, notFound } from "../http";
import data from "@/services/mock/mock-data.json";

type AuthUser = User; // no password in public user type

export async function login(email: string, password: string): Promise<{ user: AuthUser; token: string }> {
  const raw = (data.users as Array<User>).find((u) => u.email === email && u.password === password);
  if (!raw) notFound("Invalid credentials");
  const user: AuthUser = { id: raw.id, email: raw.email, role: raw.role as UserRole, name: raw.name, avatar: raw.avatar, password: raw.password };
  return simulateNetwork({ user, token: `mock-${user.id}.${Date.now()}` });
}

export async function register(input: { email: string; password: string; role: UserRole; name?: string }): Promise<AuthUser> {
  const exists = (data.users as Array<User>).find((u) => u.email === input.email);
  if (exists) throw new Error("User already exists");
  const user: AuthUser = { id: `u-${Date.now()}`, email: input.email, role: input.role, name: input.name, password: input.password };
  return simulateNetwork(user);
}
