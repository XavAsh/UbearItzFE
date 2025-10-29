"use client";

import { useI18n } from "@/lib/i18n";

export default function HomeIntro() {
  const { t } = useI18n();
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">{t("home.title")}</h1>
      <p className="mb-6 text-lg text-gray-700">{t("home.description")}</p>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t("home.how.title")}</h2>
        <ol className="list-decimal ml-6 text-gray-700">
          <li>{t("home.how.step1")}</li>
          <li>{t("home.how.step2")}</li>
          <li>{t("home.how.step3")}</li>
          <li>{t("home.how.step4")}</li>
        </ol>
      </section>
      <h2 className="text-2xl font-semibold mb-4">{t("home.restaurants.title")}</h2>
    </>
  );
}
