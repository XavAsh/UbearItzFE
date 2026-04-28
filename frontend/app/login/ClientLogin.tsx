"use client";

import LoginForm from "@/components/auth/LoginForm";
import { useAuthStore } from "@/stores/authStore";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function ClientLogin() {
  const { t } = useI18n();
  const login = useAuthStore((s) => s.login);
  const pathname = usePathname();
  const firstSegment = pathname?.split("/")[1] || "";
  const currentLocale = /^[a-zA-Z]{2}$/.test(firstSegment) ? firstSegment : "en";
  const onSubmit = async ({ email, password }: { email: string; password: string }) => {
    await login(email, password);
    const role = useAuthStore.getState().currentUser?.role;
    if (role === "ADMIN") {
      window.location.href = "/admin";
    } else {
      window.location.href = `/`;
    }
  };
  return <LoginForm onSubmit={onSubmit} submitLabel={t("auth.login.submit")} />;
}
