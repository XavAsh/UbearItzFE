"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import { getMe as apiGetMe, login as apiLogin, updateMe as apiUpdateMe } from "@/services/api/auth";

/**
 * AuthStore persists the currently logged in user/token pair in localStorage + cookies.
 * It mirrors what a classic backend session would expose to the client.
 */
type AuthState = {
  currentUser: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loadDemoUser: (email?: string) => void;
  loadMe: () => Promise<void>;
  updateProfile: (partial: { firstName?: string | null; lastName?: string | null }) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  hasRole: (...roles: UserRole[]) => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      async login(email, password) {
        const { user, token } = await apiLogin(email, password);
        document.cookie = `auth-token=${token}; path=/; max-age=604800`; // 7 days
        set({ currentUser: user, token });
      },
      loadDemoUser: (email = "alice@example.com") => {
        // for demo, call API login with known password
        get()
          .login(email, "password123")
          .catch(() => {});
      },
      async loadMe() {
        if (!get().token) return;
        try {
          const me = await apiGetMe();
          set({ currentUser: me });
        } catch {
          // Token likely expired/invalid: force a clean logout so the UI routes to login.
          document.cookie = "auth-token=; path=/; max-age=0";
          set({ currentUser: null, token: null });
        }
      },
      async updateProfile(partial) {
        const payload: { firstName?: string | null; lastName?: string | null } = {};
        if (partial.firstName !== undefined) payload.firstName = partial.firstName;
        if (partial.lastName !== undefined) payload.lastName = partial.lastName;
        const updated = await apiUpdateMe(payload);
        set({ currentUser: updated });
      },
      logout: () => {
        document.cookie = "auth-token=; path=/; max-age=0";
        set({ currentUser: null, token: null });
      },
      isAuthenticated: () => Boolean(get().token),
      hasRole: (...roles) => {
        const role = get().currentUser?.role;
        if (!role) return false;
        if (roles.length === 0) return true;
        return roles.includes(role);
      },
    }),
    { name: "auth" }
  )
);
