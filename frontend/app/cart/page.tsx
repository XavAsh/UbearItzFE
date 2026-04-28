import { buildMetadata } from "@/lib/seo";
import CartClientLoader from "./CartClientLoader";

export const metadata = {
  ...buildMetadata({
    title: "Cart | UbearItz",
    description: "Review and update your UbearItz cart before checkout.",
    path: "/cart",
  }),
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return <CartClientLoader />;
}
