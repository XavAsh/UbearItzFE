import RestaurantCatalog from "@/components/restaurant/RestaurantCatalog";
import { fetchRestaurants } from "@/lib/data/restaurants";
import { buildMetadata } from "@/lib/seo";
import HomeIntro from "./HomeIntro";

export const revalidate = 60;

export const metadata = buildMetadata({
  title: "UbearItz | Local restaurants delivered",
  description: "Discover and order from the best Annecy restaurants with UbearItz.",
  path: "/",
  images: ["/images/restaurants/le-bearitz.webp"],
});

export default async function Home() {
  let restaurants = [] as Awaited<ReturnType<typeof fetchRestaurants>>;
  try {
    restaurants = await fetchRestaurants();
  } catch {
    restaurants = [];
  }

  return (
    <main className="p-6 space-y-8">
      <HomeIntro />
      <RestaurantCatalog restaurants={restaurants} titleKey="home.restaurants.title" headingLevel={2} />
    </main>
  );
}
