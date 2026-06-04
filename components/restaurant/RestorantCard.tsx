import AppImage from "@/components/ui/AppImage";
import Card from "@/components/ui/Card";
import { PLACEHOLDER_RESTAURANT } from "@/lib/images";
import type { Restaurant } from "@/types";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Card href={`/restaurants/${restaurant.id}`}>
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <AppImage
          src={restaurant.image}
          fallback={PLACEHOLDER_RESTAURANT}
          alt={restaurant.name}
          width={640}
          height={360}
          className="w-full h-full object-cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
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
