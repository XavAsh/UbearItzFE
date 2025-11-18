import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BackToRestaurants from "@/components/common/BackToRestaurants";
import DishCard from "@/components/restaurant/DIshCard";
import { fetchRestaurantById, fetchRestaurants } from "@/lib/data/restaurants";
import { buildMetadata, buildRestaurantSchema } from "@/lib/seo";

export const revalidate = 60;

type RestaurantPageProps = {
  params: { id: string };
};

export async function generateStaticParams() {
  const restaurants = await fetchRestaurants();
  return restaurants.map((restaurant) => ({ id: restaurant.id }));
}

export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  try {
    const restaurant = await fetchRestaurantById(params.id);
    return buildMetadata({
      title: `${restaurant.name} | UbearItz`,
      description: restaurant.description,
      path: `/restaurants/${restaurant.id}`,
      images: [restaurant.image],
    });
  } catch {
    return buildMetadata({
      title: "Restaurant not found | UbearItz",
      description: "The restaurant you are looking for does not exist.",
      path: `/restaurants/${params.id}`,
    });
  }
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const restaurant = await fetchRestaurantById(params.id).catch(() => null);
  if (!restaurant) {
    notFound();
  }

  return (
    <main className="p-6">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(buildRestaurantSchema(restaurant)) }} />
      <div className="mb-6">
        <BackToRestaurants className="text-sm text-gray-600 hover:underline mb-4 inline-block" />
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-gray-700">{restaurant.description}</p>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurant.dishes.length === 0 && <p className="text-gray-500">No dishes available.</p>}
        {restaurant.dishes.map((dish) => (
          <DishCard key={dish.id} dish={dish} />
        ))}
      </div>
    </main>
  );
}
