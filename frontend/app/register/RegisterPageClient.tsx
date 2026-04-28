"use client";

import { useState } from "react";
import CreateAccountForm from "@/components/auth/CreateAccountForm";
import { register as apiRegister } from "@/services/api/auth";
import { useI18n } from "@/lib/i18n";

export default function RegisterPageClient() {
  const { t } = useI18n();
  const [success, setSuccess] = useState(false);

  async function handleSubmit({ name, email, password }: { name: string; email: string; password: string }) {
    setSuccess(false);
    await apiRegister({ name, email, password });
    setSuccess(true);
    window.location.href = "/login";
  }

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {success && <p className="text-sm">{t("auth.register.success")}</p>}
      <CreateAccountForm onSubmit={handleSubmit} submitLabel={t("auth.register.submit")} />
    </div>
  );
}

