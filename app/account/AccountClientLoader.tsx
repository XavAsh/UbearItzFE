"use client";

import dynamic from "next/dynamic";

const AccountPageClient = dynamic(() => import("./AccountPageClient"), {
  ssr: false,
  loading: () => <p>Loading account…</p>,
});

export default function AccountClientLoader() {
  return <AccountPageClient />;
}

