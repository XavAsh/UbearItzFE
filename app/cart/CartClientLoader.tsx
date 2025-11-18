"use client";

import dynamic from "next/dynamic";

const CartPageClient = dynamic(() => import("./CartPageClient"), {
  ssr: false,
  loading: () => <p>Loading cart…</p>,
});

export default function CartClientLoader() {
  return <CartPageClient />;
}

