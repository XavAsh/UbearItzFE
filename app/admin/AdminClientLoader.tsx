"use client";

import dynamic from "next/dynamic";

const AdminPageClient = dynamic(() => import("./AdminPageClient"), {
  ssr: false,
  loading: () => <p>Loading admin dashboard…</p>,
});

export default function AdminClientLoader() {
  return <AdminPageClient />;
}

