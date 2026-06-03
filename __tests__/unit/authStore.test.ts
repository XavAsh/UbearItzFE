import { describe, it, expect, beforeEach, vi } from "vitest";
import { useAuthStore } from "@/stores/authStore";

let mockUser: { id: string; email: string; role: "USER" | "ADMIN" | "RESTAURANT"; firstName?: string | null; lastName?: string | null } | null = null;

vi.mock("@/services/api/auth", () => ({
  login: vi.fn(async (email: string) => ({
    user: (() => {
      mockUser = { id: "u-1", email, role: "USER", firstName: "Alice", lastName: "Demo" };
      return mockUser;
    })(),
    token: "mock-token",
  })),
  getMe: vi.fn(async () => {
    if (!mockUser) throw new Error("No mock user");
    return mockUser;
  }),
  updateMe: vi.fn(async (input: { firstName?: string | null; lastName?: string | null }) => {
    if (!mockUser) throw new Error("No mock user");
    mockUser = { ...mockUser, ...input };
    return mockUser;
  }),
}));

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ currentUser: null, token: null });
    mockUser = null;
    document.cookie = "auth-token=; path=/; max-age=0";
  });

  it("logs in and sets state", async () => {
    await useAuthStore.getState().login("alice@example.com", "password123");
    const { currentUser, token } = useAuthStore.getState();
    expect(currentUser?.email).toBe("alice@example.com");
    expect(token).toBeTruthy();
  });

  it("updates profile in place", async () => {
    await useAuthStore.getState().login("alice@example.com", "password123");
    await useAuthStore.getState().updateProfile({ firstName: "Alice", lastName: "Updated" });
    expect(useAuthStore.getState().currentUser?.firstName).toBe("Alice");
    expect(useAuthStore.getState().currentUser?.lastName).toBe("Updated");
  });

  it("logs out and clears token", async () => {
    await useAuthStore.getState().login("alice@example.com", "password123");
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().currentUser).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
