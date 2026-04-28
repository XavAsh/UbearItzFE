"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

type CreateAccountFormProps = {
  onSubmit?: (data: { name: string; email: string; password: string }) => void | Promise<void>;
  submitLabel?: string;
  showLinks?: boolean;
};

export default function CreateAccountForm({ onSubmit, submitLabel = "Create account", showLinks = true }: CreateAccountFormProps) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      if (!onSubmit) return;
      await onSubmit({ name, email, password });
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.description"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="space-y-1">
        <label htmlFor="name" className="block text-sm font-medium">
          {t("auth.form.name")}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder={t("auth.form.namePlaceholder")}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium">
          {t("auth.form.email")}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder={t("auth.form.emailPlaceholder")}
        />
      </div>
      <div className="space-y-1">
        <label htmlFor="password" className="block text-sm font-medium">
          {t("auth.form.password")}
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
          placeholder={t("auth.form.passwordPlaceholder")}
        />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-black text-white rounded px-4 py-2 disabled:opacity-60">
        {loading ? t("auth.form.pleaseWait") : submitLabel}
      </button>

      {showLinks && (
        <p className="text-sm text-center">
          {t("auth.form.alreadyHaveAccount")}{" "}
          <a href="/login" className="underline">
            {t("nav.login")}
          </a>
        </p>
      )}
    </form>
  );
}
