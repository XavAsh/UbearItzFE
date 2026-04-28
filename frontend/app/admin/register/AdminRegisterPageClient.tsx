"use client";

import CreateAccountForm from "@/components/auth/CreateAccountForm";
import { register as apiRegister } from "@/services/api/auth";
import { useI18n } from "@/lib/i18n";

export default function AdminRegisterPageClient() {
  const { t } = useI18n();
  async function handleSubmit({ name, email, password }: { name: string; email: string; password: string }) {
    await apiRegister({ name, email, password });
    window.location.href = "/login";
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="w-full flex flex-col items-center gap-6">
        <h1 className="text-2xl font-semibold">{t("auth.register.title")}</h1>
        <CreateAccountForm onSubmit={handleSubmit} submitLabel={t("auth.register.submit")} />
      </div>
    </main>
  );
}

