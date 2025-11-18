"use client";

import { useEffect, useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useAuthStore } from "@/stores/authStore";
import { useI18n } from "@/lib/i18n";

export default function AccountPageClient() {
  const { currentUser, updateProfile, logout } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { t } = useI18n();

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name ?? "");
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  const onSave = () => updateProfile({ name, email });

  return (
    <RequireAuth>
      <main className="p-6 space-y-4">
        <h1 className="text-3xl font-semibold">{t("account.title")}</h1>
        {!currentUser && <p>{t("account.loading")}</p>}
        {currentUser && (
          <>
            <div>
              <p>
                <strong>{t("account.loggedInAs")}:</strong> {currentUser.email}
              </p>
              <p>
                <strong>{t("account.role")}:</strong> {currentUser.role}
              </p>
            </div>
            <label className="block">
              <span className="text-sm font-medium">{t("account.name")}</span>
              <input value={name} onChange={(e) => setName(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </label>
            <label className="block">
              <span className="text-sm font-medium">{t("account.email")}</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="border rounded px-3 py-2 w-full" />
            </label>
            <div className="flex gap-2">
              <button onClick={onSave} className="bg-black text-white px-4 py-2 rounded">
                {t("actions.save")}
              </button>
              <button onClick={logout} className="underline">
                {t("actions.logout")}
              </button>
            </div>
          </>
        )}
      </main>
    </RequireAuth>
  );
}

