"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

type Props = {
  className?: string;
  restaurantId?: string;
};

export default function BackToRestaurants({ className = "", restaurantId }: Props) {
  const { t } = useI18n();
  const pathname = usePathname();
  const first = pathname?.split("/")[1];
  const isLocale = first === "en" || first === "fr";
  const locale = isLocale ? (first as "en" | "fr") : "en";
  const href = restaurantId ? (isLocale ? `/${locale}/restaurants/${restaurantId}` : `/restaurants/${restaurantId}`) : isLocale ? `/${locale}` : "/";
  return (
    <Link href={href} className={className}>
      {t("restaurant.back")}
    </Link>
  );
}
