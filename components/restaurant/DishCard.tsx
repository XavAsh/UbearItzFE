import Image from "next/image";
import Card from "@/components/ui/Card";
import type { Dish } from "@/types";

type DishCardProps = {
  dish: Dish;
  showRestaurant?: boolean;
};

export default function DishCard({ dish, showRestaurant = false }: DishCardProps) {
  return (
    <Card href={`/dishes/${dish.id}`}>
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <Image src={dish.image} alt={dish.name} width={640} height={360} className="w-full h-full object-cover" loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{dish.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{dish.description}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-lg">€{dish.price.toFixed(2)}</span>
          {showRestaurant && <span className="text-xs text-gray-500">Restaurant: {dish.restaurantId}</span>}
        </div>
      </div>
    </Card>
  );
}
