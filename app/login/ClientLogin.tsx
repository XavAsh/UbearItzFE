"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useAuthStore } from "@/stores/authStore";

export default function ClientLogin() {
  const login = useAuthStore((s) => s.login);
  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    await login(email, password);
    window.location.href = "/account";
  };
  return <LoginForm onSubmit={onSubmit} />;
}
