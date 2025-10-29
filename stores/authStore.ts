"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { login as apiLogin } from "@/services/api/auth";

type AuthState = {
  currentUser: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loadDemoUser: (email?: string) => void;
  updateProfile: (partial: Partial<User>) => void;
  logout: () => void;
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
      updateProfile: (partial) => {
        const curr = get().currentUser;
        if (!curr) return;
        set({ currentUser: { ...curr, ...partial } });
      },
      logout: () => {
        document.cookie = "auth-token=; path=/; max-age=0";
        set({ currentUser: null, token: null });
      },
    }),
    { name: "auth" }
  )
);
