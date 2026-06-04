export const PLACEHOLDER_RESTAURANT = "/images/placeholder-restaurant.svg";
export const PLACEHOLDER_DISH = "/images/placeholder-dish.svg";

/** Files under ubearitzFE/public/images — served as /images/... by Next.js */
export const RESTAURANT_IMAGES = {
  leBearitz: "/images/restaurants/Le-Bearitz.webp",
  sushiAnnecy: "/images/restaurants/Sushi-Annecy.webp",
} as const;

export const DISH_IMAGES = {
  trufflePasta: "/images/dishes/Truffle-Pasta.avif",
  herbChicken: "/images/dishes/Herb-Chicken.webp",
  salmonNigiri: "/images/dishes/Salmon-Nigiri.webp",
  spicyTunaRoll: "/images/dishes/Spicy-Tuna-Roll.webp",
} as const;

const DEFAULT_FALLBACK = PLACEHOLDER_DISH;

/** Next/Image requires a non-empty src; use local placeholders when the API has no imageUrl. */
export function resolveImageSrc(
  src: string | null | undefined,
  fallback: string = DEFAULT_FALLBACK,
): string {
  const safeFallback = fallback.trim() || DEFAULT_FALLBACK;
  const trimmed = (src ?? "").trim();
  return trimmed || safeFallback;
}

export function nonEmptyImageUrls(urls: Array<string | null | undefined> | undefined): string[] {
  return (urls ?? []).map((url) => (url ?? "").trim()).filter(Boolean);
}
