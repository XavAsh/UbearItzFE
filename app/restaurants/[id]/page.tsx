import { getRestaurantById } from "@/services/api/restaurants";
import Link from "next/link";
import DishCard from "@/components/restaurant/DIshCard";

export default async function RestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const restaurant = await getRestaurantById(id);
  return (
    <main>
      <div className="mb-6">
        <Link href="/" className="text-sm text-gray-600 hover:underline mb-4 inline-block">
          ← Back to Restaurants
        </Link>
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-gray-700">{restaurant.description}</p>
      </div>
      <h2 className="text-2xl font-semibold mb-4">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurant.dishes.map((d) => (
          <DishCard key={d.id} dish={d} />
        ))}
      </div>
    </main>
  );
}
