import { getDishById } from "@/services/api/dishes";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";
import Image from "next/image";
import BackToRestaurants from "@/components/common/BackToRestaurants";

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = await getDishById(id);
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4">
        <BackToRestaurants restaurantId={dish.restaurantId} className="text-sm text-gray-600 hover:underline mb-4 inline-block" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="w-full overflow-hidden rounded-lg border bg-white">
          <Image src={dish.image} alt={dish.name} width={800} height={450} sizes="(max-width: 768px) 100vw, 800px" className="w-full h-auto object-cover" priority />
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{dish.name}</h1>
          <p className="text-gray-700 leading-relaxed">{dish.description}</p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-2xl font-semibold">€{dish.price.toFixed(2)}</span>
          </div>

          <div className="pt-4">
            <AddToCartButton dish={dish} />
          </div>
        </div>
      </div>
    </main>
  );
}
