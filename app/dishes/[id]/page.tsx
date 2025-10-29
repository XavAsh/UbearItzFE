import { getDishById } from "@/services/api/dishes";
import Link from "next/link";
import { AddToCartButton } from "./AddToCartButton";

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = await getDishById(id);
  return (
    <main>
      <h1>{dish.name}</h1>
      <p>{dish.description}</p>
      <AddToCartButton dish={dish} />
      <Link href={`/restaurants/${dish.restaurantId}`}>Back to Restaurant</Link>
    </main>
  );
}
