import dynamic from "next/dynamic";
import { buildMetadata } from "@/lib/seo";

const AccountPageClient = dynamic(() => import("./AccountPageClient"), {
  ssr: false,
  loading: () => <p>Loading account…</p>,
});

export const metadata = {
  ...buildMetadata({
    title: "My Account | UbearItz",
    description: "Manage your UbearItz profile information.",
    path: "/account",
  }),
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountPageClient />;
}
