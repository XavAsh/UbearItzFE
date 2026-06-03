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

type MeResponse = { user: User };

export async function getMe(): Promise<User> {
  // Backend returns `{ user: request.user }` for `/auth/me`.
  const res = await apiFetch<MeResponse>("/auth/me", { auth: true });
  return res.user;
}

export async function updateMe(input: { firstName?: string | null; lastName?: string | null }): Promise<User> {
  // Backend expects PATCH `/users/me` with `firstName` and/or `lastName`.
  const payload: { firstName?: string | null; lastName?: string | null } = {};
  if (input.firstName !== undefined) payload.firstName = input.firstName;
  if (input.lastName !== undefined) payload.lastName = input.lastName;

  return apiFetch<User>("/users/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(payload),
  });
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
