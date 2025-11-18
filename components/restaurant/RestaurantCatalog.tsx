"use client";

import { useMemo, useState } from "react";
import type { Restaurant } from "@/types";
import SearchBar from "@/components/common/SearchBar";
import RestaurantCard from "@/components/restaurant/RestorantCard";
import { useI18n } from "@/lib/i18n";

type RestaurantCatalogProps = {
  restaurants: Restaurant[];
  title?: string;
  titleKey?: string;
  headingLevel?: 1 | 2 | 3;
};

export default function RestaurantCatalog({ restaurants, title, titleKey = "catalog.title", headingLevel = 2 }: RestaurantCatalogProps) {
  const [query, setQuery] = useState("");
  const { t } = useI18n();

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return restaurants;
    return restaurants.filter((restaurant) => {
      const description = restaurant.description?.toLowerCase() ?? "";
      const city = restaurant.city?.toLowerCase() ?? "";
      return restaurant.name.toLowerCase().includes(trimmed) || city.includes(trimmed) || description.includes(trimmed);
    });
  }, [query, restaurants]);

  const HeadingTag = headingLevel === 1 ? "h1" : headingLevel === 2 ? "h2" : "h3";
  const headingText = title ?? t(titleKey);

  return (
    <section>
      <div className="flex flex-col gap-3 mb-4">
        <HeadingTag className="text-2xl font-semibold">{headingText}</HeadingTag>
        <SearchBar value={query} onChange={setQuery} placeholder={t("catalog.search")} />
      </div>
      {filtered.length === 0 ? (
        <p className="text-gray-600">{t("catalog.noResults")}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      )}
    </section>
  );
}

