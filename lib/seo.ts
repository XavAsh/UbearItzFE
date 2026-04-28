import type { Metadata } from "next";
import type { Dish, Restaurant } from "@/types";

const SITE_NAME = "UbearItz";
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ubearitz.local";

const toAbsoluteUrl = (path = "") => {
  try {
    return new URL(path, BASE_URL).toString();
  } catch {
    return BASE_URL;
  }
};

type SeoParams = {
  title: string;
  description: string;
  path?: string;
  images?: string[];
};

export function buildMetadata({ title, description, path = "/", images }: SeoParams): Metadata {
  const url = toAbsoluteUrl(path);
  const imageEntries = images?.map((image) => ({ url: toAbsoluteUrl(image) }));
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: imageEntries,
      type: "website",
    },
    twitter: {
      card: images && images.length > 0 ? "summary_large_image" : "summary",
      title,
      description,
      images,
    },
    alternates: {
      canonical: url,
    },
  };
}

export function buildRestaurantSchema(restaurant: Restaurant) {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    image: toAbsoluteUrl(restaurant.image),
    url: toAbsoluteUrl(`/restaurants/${restaurant.id}`),
    address: restaurant.address
      ? {
          "@type": "PostalAddress",
          streetAddress: restaurant.address,
          postalCode: restaurant.postalCode,
          addressLocality: restaurant.city,
          addressCountry: "FR",
        }
      : undefined,
  };
}

export function buildDishSchema(dish: Dish) {
  return {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: toAbsoluteUrl(dish.image),
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: dish.price.toFixed(2),
    },
  };
}


