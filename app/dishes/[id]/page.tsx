import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./AddToCartButton";
import Image from "next/image";
import BackToRestaurants from "@/components/common/BackToRestaurants";
import { fetchDishById } from "@/lib/data/dishes";
import { buildDishSchema, buildMetadata } from "@/lib/seo";

export const revalidate = 60;

type DishPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: DishPageProps): Promise<Metadata> {
  try {
    const dish = await fetchDishById(params.id);
    return buildMetadata({
      title: `${dish.name} | UbearItz`,
      description: dish.description,
      path: `/dishes/${dish.id}`,
      images: [dish.image],
    });
  } catch {
    return buildMetadata({
      title: "Dish not found | UbearItz",
      description: "The dish you are looking for is unavailable.",
      path: `/dishes/${params.id}`,
    });
  }
}

export default async function DishPage({ params }: DishPageProps) {
  const { id } = params;
  const dish = await fetchDishById(id).catch(() => null);
  if (!dish) {
    notFound();
  }
  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <script type="application/ld+json" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: JSON.stringify(buildDishSchema(dish)) }} />
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
