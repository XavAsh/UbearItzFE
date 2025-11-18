import dynamic from "next/dynamic";
import { buildMetadata } from "@/lib/seo";

const AdminPageClient = dynamic(() => import("./AdminPageClient"), {
  ssr: false,
  loading: () => <p>Loading admin dashboard…</p>,
});

export const metadata = {
  ...buildMetadata({
    title: "Admin | UbearItz",
    description: "Manage restaurants and partners on UbearItz.",
    path: "/admin",
  }),
  robots: { index: false, follow: false },
};

export default function AdminRestaurantsPage() {
  return <AdminPageClient />;
}
