import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/stores/authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.setState({ currentUser: null, token: null });
    document.cookie = "auth-token=; path=/; max-age=0";
  });

  it("logs in with mock credentials and sets state", async () => {
    await useAuthStore.getState().login("alice@example.com", "password123");
    const { currentUser, token } = useAuthStore.getState();
    expect(currentUser?.email).toBe("alice@example.com");
    expect(token).toBeTruthy();
  });

  it("updates profile in place", async () => {
    await useAuthStore.getState().login("alice@example.com", "password123");
    useAuthStore.getState().updateProfile({ name: "Alice Updated" });
    expect(useAuthStore.getState().currentUser?.name).toBe("Alice Updated");
  });

  it("logs out and clears token", async () => {
    await useAuthStore.getState().login("alice@example.com", "password123");
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().currentUser).toBeNull();
    expect(useAuthStore.getState().token).toBeNull();
  });
});
