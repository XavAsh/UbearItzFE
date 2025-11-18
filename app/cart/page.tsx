import dynamic from "next/dynamic";
import { buildMetadata } from "@/lib/seo";

const CartPageClient = dynamic(() => import("./CartPageClient"), {
  ssr: false,
  loading: () => <p>Loading cart…</p>,
});

export const metadata = {
  ...buildMetadata({
    title: "Cart | UbearItz",
    description: "Review and update your UbearItz cart before checkout.",
    path: "/cart",
  }),
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartPageClient />;
}
