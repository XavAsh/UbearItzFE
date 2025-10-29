import { getRestaurants } from "@/services/api/restaurants";
import RestaurantCard from "@/components/restaurant/RestorantCard";

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants();
  if (!restaurants.length) {
    return <div>No restaurants found</div>;
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((r) => (
        <RestaurantCard key={r.id} restaurant={r} />
      ))}
    </div>
  );
}
