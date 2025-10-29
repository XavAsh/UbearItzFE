"use client";

import { useCartStore } from "@/stores/cartStore";
import type { Dish } from "@/types";
import Link from "next/link";

export function AddToCartButton({ dish }: { dish: Dish }) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <Link href="/cart" onClick={() => addItem(dish)}>
      Add to Cart
    </Link>
  );
}
