import dynamic from "next/dynamic";
import { buildMetadata } from "@/lib/seo";

const OrdersPageClient = dynamic(() => import("./OrdersPageClient"), {
  ssr: false,
  loading: () => <p>Loading orders…</p>,
});

export const metadata = {
  ...buildMetadata({
    title: "My Orders | UbearItz",
    description: "Track your past orders and reorder your favourites.",
    path: "/orders",
  }),
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return <OrdersPageClient />;
}
