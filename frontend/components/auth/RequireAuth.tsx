"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { UserRole } from "@/types";
import { useAuthStore } from "@/stores/authStore";
import { useI18n } from "@/lib/i18n";

type RequireAuthProps = {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackMessage?: string;
};

type PersistHelpers = {
  hasHydrated?: () => boolean;
  onFinishHydration?: (callback: () => void) => () => void;
};

const authPersist = (useAuthStore as typeof useAuthStore & { persist?: PersistHelpers }).persist;

export default function RequireAuth({ children, allowedRoles, fallbackMessage }: RequireAuthProps) {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [hydrated, setHydrated] = useState(() => authPersist?.hasHydrated?.() ?? false);
  const { t } = useI18n();

  useEffect(() => {
    if (!authPersist?.onFinishHydration) {
      setHydrated(true);
      return;
    }
    const unsub = authPersist.onFinishHydration(() => setHydrated(true));
    return () => {
      unsub?.();
    };
  }, []);

  if (!hydrated) {
    return (
      <main className="p-6">
        <p>{t("auth.loading")}</p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">{t("auth.requiredTitle")}</h1>
        <p className="mb-4">{fallbackMessage ?? t("auth.requiredMessage")}</p>
        <Link href="/login" className="underline text-blue-600">
          Go to login
        </Link>
      </main>
    );
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold mb-4">{t("auth.accessDeniedTitle")}</h1>
        <p>{t("auth.accessDeniedMessage")}</p>
      </main>
    );
  }

  return <>{children}</>;
}

