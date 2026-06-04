"use client";

import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { getLoginErrorMessage } from "@/lib/authErrors";
import { getLoginChallenge } from "@/services/api/auth";

type LoginFormProps = {
  onSubmit?: (data: { email: string; password: string; humanCheck: boolean }) => void | Promise<void>;
  submitLabel?: string;
  showLinks?: boolean;
};

export default function LoginForm({ onSubmit, submitLabel = "Log in", showLinks = true }: LoginFormProps) {
  const { t, locale } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [humanChecked, setHumanChecked] = useState(false);
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshChallenge = useCallback(async (address: string) => {
    const trimmed = address.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setCaptchaRequired(false);
      return;
    }
    try {
      const status = await getLoginChallenge(trimmed);
      setCaptchaRequired(status.captchaRequired);
    } catch {
      setCaptchaRequired(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshChallenge(email);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [email, refreshChallenge]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    if (captchaRequired && !humanChecked) {
      setError(t("auth.login.humanCheckRequired"));
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (!onSubmit) return;
      await onSubmit({ email, password, humanCheck: humanChecked });
    } catch (err) {
      setError(getLoginErrorMessage(err, locale));
      await refreshChallenge(email);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md w-full space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="space-y-1">
        <label htmlFor="email" className="block text-sm font-medium">
          {t("auth.form.email")}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setHumanChecked(false);
          }}
          onBlur={() => void refreshChallenge(email)}
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
      {captchaRequired && (
        <label className="flex items-start gap-3 rounded border border-gray-300 bg-gray-50 px-3 py-3 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={humanChecked}
            onChange={(e) => setHumanChecked(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0"
          />
          <span>{t("auth.login.humanCheckLabel")}</span>
        </label>
      )}
      <button
        type="submit"
        disabled={loading || (captchaRequired && !humanChecked)}
        className="w-full bg-black text-white rounded px-4 py-2 disabled:opacity-60"
      >
        {loading ? t("auth.form.pleaseWait") : submitLabel}
      </button>
      {showLinks && (
        <p className="text-sm text-center">
          {t("auth.form.dontHaveAccount")}{" "}
          <a href="/register" className="underline">
            {t("nav.register")}
          </a>
        </p>
      )}
    </form>
  );
}
