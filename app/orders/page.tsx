import { buildMetadata } from "@/lib/seo";
import OrdersClientLoader from "./OrdersClientLoader";

export const metadata = {
  ...buildMetadata({
    title: "My Orders | UbearItz",
    description: "Track your past orders and reorder your favourites.",
    path: "/orders",
  }),
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return <OrdersClientLoader />;
}
