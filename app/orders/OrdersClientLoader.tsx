"use client";

import dynamic from "next/dynamic";

const OrdersPageClient = dynamic(() => import("./OrdersPageClient"), {
  ssr: false,
  loading: () => <p>Loading orders…</p>,
});

export default function OrdersClientLoader() {
  return <OrdersPageClient />;
}

