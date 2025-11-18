import type { Metadata } from "next";
import { fetchRestaurants } from "@/lib/data/restaurants";
import RestaurantCatalog from "@/components/restaurant/RestaurantCatalog";
import { buildMetadata } from "@/lib/seo";
import { cookies } from "next/headers";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/dictionary";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const restaurants = await fetchRestaurants();
    return buildMetadata({
      title: `(${restaurants.length}) Restaurants near you | UbearItz`,
      description: "Browse the latest curated restaurants serving Annecy and beyond.",
      path: "/restaurants",
      images: restaurants.slice(0, 3).map((restaurant) => restaurant.image),
    });
  } catch {
    return buildMetadata({
      title: "Restaurants | UbearItz",
      description: "Browse curated restaurants on UbearItz.",
      path: "/restaurants",
    });
  }
}

export default async function RestaurantsPage() {
  const cookieStore = cookies();
  const locale = (cookieStore.get("NEXT_LOCALE")?.value as Locale | undefined) ?? (cookieStore.get("locale")?.value as Locale | undefined) ?? "en";
  const dict = getDictionary(locale);
  try {
    const restaurants = await fetchRestaurants();

    if (!restaurants.length) {
      return (
        <main className="p-6">
          <h1 className="text-3xl font-semibold mb-4">{dict["catalog.title"]}</h1>
          <p>{dict["catalog.empty"]}</p>
        </main>
      );
    }

    return (
      <main className="p-6">
        <RestaurantCatalog restaurants={restaurants} headingLevel={1} />
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : dict["catalog.error"];
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-3xl font-semibold">{dict["catalog.title"]}</h1>
        <p className="text-red-600">{message}</p>
      </main>
    );
  }
}
