import { buildMetadata } from "@/lib/seo";
import AdminClientLoader from "./AdminClientLoader";

export const metadata = {
  ...buildMetadata({
    title: "Admin | UbearItz",
    description: "Manage restaurants and partners on UbearItz.",
    path: "/admin",
  }),
  robots: { index: false, follow: false },
};

export default function AdminRestaurantsPage() {
  return <AdminClientLoader />;
}
