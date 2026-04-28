import { buildMetadata } from "@/lib/seo";
import AccountClientLoader from "./AccountClientLoader";

export const metadata = {
  ...buildMetadata({
    title: "My Account | UbearItz",
    description: "Manage your UbearItz profile information.",
    path: "/account",
  }),
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountClientLoader />;
}
