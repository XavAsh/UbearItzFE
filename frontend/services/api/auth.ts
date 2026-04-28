import type { User } from "@/types";
import { apiFetch } from "../http";

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return { user: res.user, token: res.accessToken };
}

type RegisterResponse = User;

function splitName(name?: string) {
  const raw = (name ?? "").trim();
  if (!raw) return { firstName: undefined, lastName: undefined };
  const [first, ...rest] = raw.split(/\s+/);
  return { firstName: first, lastName: rest.length ? rest.join(" ") : undefined };
}

export async function register(input: { email: string; password: string; name?: string }): Promise<User> {
  const { firstName, lastName } = splitName(input.name);
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ email: input.email, password: input.password, firstName, lastName }),
  });
}
