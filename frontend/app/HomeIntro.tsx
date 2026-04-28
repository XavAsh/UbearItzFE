"use client";

import { useI18n } from "@/lib/i18n";

export default function HomeIntro() {
  const { t } = useI18n();
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{t("home.title")}</h1>
      <h2 className="text-2xl font-semibold mb-4">{t("home.restaurants.title")}</h2>
    </>
  );
}
