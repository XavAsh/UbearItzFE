import Card from "@/components/ui/Card";
import type { Restaurant } from "@/types";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card href={`/restaurants/${restaurant.id}`}>
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img src={restaurant.image || "/placeholder-restaurant.jpg"} alt={restaurant.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{restaurant.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{restaurant.description}</p>
        {restaurant.dishes?.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            {restaurant.dishes.length} dish{restaurant.dishes.length !== 1 ? "es" : ""}
          </p>
        )}
      </div>
    </Card>
  );
}
