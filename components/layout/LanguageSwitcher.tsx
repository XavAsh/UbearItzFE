"use client";

import { useI18n } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <div className="flex items-center gap-2">
      <button aria-pressed={locale === "en"} onClick={() => setLocale("en")} className="underline disabled:opacity-60" disabled={locale === "en"}>
        {t("lang.english")}
      </button>
      <span>/</span>
      <button aria-pressed={locale === "fr"} onClick={() => setLocale("fr")} className="underline disabled:opacity-60" disabled={locale === "fr"}>
        {t("lang.french")}
      </button>
    </div>
  );
}
