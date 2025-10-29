"use client";

import { useI18n } from "@/lib/i18n";
import { usePathname, useRouter } from "next/navigation";

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (target: "en" | "fr") => {
    setLocale(target);
    const nextPath = pathname?.replace(/^\/(en|fr)(?=\/|$)/, `/${target}`) || `/${target}`;
    router.push(nextPath);
  };
  return (
    <div className="flex items-center gap-2">
      <button aria-pressed={locale === "en"} onClick={() => switchTo("en")} className="underline disabled:opacity-60" disabled={locale === "en"}>
        {t("lang.english")}
      </button>
      <span>/</span>
      <button aria-pressed={locale === "fr"} onClick={() => switchTo("fr")} className="underline disabled:opacity-60" disabled={locale === "fr"}>
        {t("lang.french")}
      </button>
    </div>
  );
}
